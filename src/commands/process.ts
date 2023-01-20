import { Command, Flags } from "@oclif/core";
import Listr from "listr";
import { processWorkflow } from "rejig-processing";
import * as yaml from "js-yaml";
import fs from "node:fs";
import { watch } from "node:fs/promises";
import path from "node:path";
import {
  Workflow,
  getDefaultWorkflow,
  isValid,
} from "rejig-processing/lib/models/Workflow";

export default class Process extends Command {
  static description =
    "Process one or more workflows in YAML or JSON format, then output an image.";

  static examples = [`$ rejig process workflow.yaml`];

  static flags = {
    watch: Flags.boolean({
      char: "w",
      description:
        "Watch workflow files for changes and re-process them when they do.",
      default: false,
    }),
    out: Flags.string({
      char: "o",
      description:
        "Specify folder to write images to. Defaults to the folder the workflow is in.",
    }),
  };

  static args = [
    {
      name: "workflow",
      description: "Workflow or folder of workflows to process",
      required: true,
    },
  ];

  async run(): Promise<void> {
    const { args, flags } = await this.parse(Process);

    const doesPathExist = fs.existsSync(args.workflow);
    const isDirectory = doesPathExist
      ? fs.lstatSync(args.workflow).isDirectory()
      : false;

    if (isDirectory) {
      const filesInDir = fs.readdirSync(args.workflow).filter((f) => {
        const lowercaseFile = f.toLocaleLowerCase();
        return (
          lowercaseFile.endsWith(".yml") ||
          lowercaseFile.endsWith(".yaml") ||
          lowercaseFile.endsWith(".json")
        );
      });

      const tasks = new Listr([
        {
          title: `Scanning '${args.workflow}'...`,
          task: () => {
            throw new Error("No workflows found");
          },
          enabled: () => filesInDir.length === 0,
        },
        {
          title: `Process workflows in directory '${args.workflow}'`,
          task: async () => {
            const subtasks: Listr.ListrTask[] = [];

            for await (const file of filesInDir) {
              const processTasks = await this.process(
                path.resolve(args.workflow, file),
                flags.out
              );
              subtasks.push({
                title: `Process '${path.basename(file)}'`,
                task: () => new Listr(processTasks),
              });
            }

            return new Listr(subtasks);
          },
          enabled: () => filesInDir.length > 0,
        },
        {
          title: "Watch for changes...",
          task: () => {
            /* NOOP */
          },
          enabled: () => flags.watch && filesInDir.length > 0,
        },
      ]);

      try {
        await tasks.run();
      } catch {
        this.exit(2);
      }

      if (flags.watch) {
        await Promise.all(
          (filesInDir as string[]).map((file) =>
            this.watch(path.resolve(args.workflow, file), flags.out)
          )
        );
      }
    } else {
      const tasks = new Listr([
        {
          title: `Scanning '${args.workflow}'...`,
          task: () => {
            throw new Error(`Path '${args.workflow}' does not exist`);
          },
          enabled: () => !doesPathExist,
        },
        ...(await this.process(args.workflow, flags.out)),
        {
          title: "Watch for changes...",
          task: () => {
            /* NOOP */
          },
          enabled: () => flags.watch,
        },
      ]);

      try {
        await tasks.run();
      } catch {
        this.exit(2);
      }

      if (flags.watch) {
        this.watch(args.workflow, flags.out);
      }
    }
  }

  async watch(file: string, outDir?: string): Promise<void> {
    try {
      const watcher = watch(file);

      for await (const event of watcher) {
        if (event.eventType === "change") {
          try {
            new Listr([
              {
                title: `Process '${path.basename(file)}'`,
                task: async () => new Listr(await this.process(file, outDir)),
              },
            ]).run();
          } catch {
            this.exit(2);
          }
        }
      }
    } catch {
      throw new Error(
        `Something went wrong watching for changes to '${path.basename(
          file
        )}' :(`
      );
    }
  }

  async process(
    workflowPath: string,
    outDir?: string
  ): Promise<Listr.ListrTask<any>[]> {
    const workflowFilename = path.basename(workflowPath);

    return [
      {
        title: "Validate workflow",
        task: async (ctx) => {
          const workflow = this.loadFile(workflowPath);

          if (!workflow) {
            throw new Error(`Workflow '${workflowFilename}' does not exist!`);
          }

          if (!(await isValid(workflow))) {
            throw new Error(`Workflow '${workflowFilename}' is not valid!`);
          }

          ctx.workflow = workflow;
        },
      },
      {
        title: "Process workflow",
        task: async (ctx) => {
          const { workflow }: { workflow: Workflow } = ctx;
          const outputFolder = outDir
            ? path.resolve(outDir)
            : path.dirname(workflowPath);

          const outputFilename =
            workflow.name ??
            path.basename(workflowPath.replace(/.ya?ml$/i, "")) ??
            "image";

          const outputPath = `${outputFolder}/${outputFilename}.png`;

          const image = await processWorkflow(getDefaultWorkflow(workflow));

          ctx.outputPath = outputPath;
          ctx.image = image;
        },
      },
      {
        title: "Save image",
        task: (ctx) => {
          this.writeFile(ctx.image, ctx.outputPath);
        },
      },
    ];
  }

  loadFile(workflowPath: string): Workflow | void {
    const lowercaseFile = workflowPath.toLocaleLowerCase();

    if (lowercaseFile.endsWith(".yml") || lowercaseFile.endsWith(".yaml")) {
      return yaml.load(
        fs.readFileSync(path.resolve(workflowPath), "utf-8")
      ) as Workflow;
    }

    if (lowercaseFile.endsWith(".json")) {
      return JSON.parse(
        // eslint-disable-next-line unicorn/prefer-json-parse-buffer
        fs.readFileSync(path.resolve(workflowPath), "utf-8")
      ) as Workflow;
    }
  }

  writeFile(image: string, outputPath: string): void {
    const outputFolder = path.dirname(outputPath);
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    const base64Matches = image.match(/^data:([+/A-Za-z-]+);base64,(.+)$/);
    if (!base64Matches) {
      this.error("Not a valid Base64 image from Rejig.Processing");
    }

    const buffer = Buffer.from(base64Matches[2], "base64");
    fs.writeFileSync(path.resolve(outputPath), buffer);
  }
}
