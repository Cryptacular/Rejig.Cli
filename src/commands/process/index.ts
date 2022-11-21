import { Command, Flags } from "@oclif/core";
import { processWorkflow } from "rejig-processing";
import * as Jimp from "jimp";
import * as yaml from "js-yaml";
import fs from "node:fs";
import { watch } from "node:fs/promises";
import path from "node:path";
import {
  Workflow,
  getDefaultWorkflow,
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

    const isDirectory = fs.lstatSync(args.workflow).isDirectory();

    if (isDirectory) {
      const filesInDir = fs.readdirSync(args.workflow).filter((f) => {
        const lowercaseFile = f.toLocaleLowerCase();
        return (
          lowercaseFile.endsWith(".yml") ||
          lowercaseFile.endsWith(".yaml") ||
          lowercaseFile.endsWith(".json")
        );
      });

      this.log(
        `Attempting to process the following files:\n${filesInDir
          .map((f) => "  · " + path.basename(f))
          .join("\n")}`
      );

      await Promise.all(
        filesInDir.map((file) =>
          this.process(path.resolve(args.workflow, file), flags.out)
        )
      );

      if (flags.watch) {
        await Promise.all(
          filesInDir.map((file) =>
            this.watch(path.resolve(args.workflow, file), flags.out)
          )
        );
      }
    } else {
      await this.process(args.workflow, flags.out);

      if (flags.watch) {
        this.watch(args.workflow, flags.out);
      }
    }
  }

  async watch(file: string, outDir?: string): Promise<void> {
    this.log(`Watching for changes to '${path.basename(file)}'...`);

    try {
      const watcher = watch(file);

      for await (const event of watcher) {
        if (event.eventType === "change") {
          await this.process(file, outDir);
        }
      }
    } catch (error) {
      this.log(
        `✗ Something went wrong watching for changes to '${path.basename(
          file
        )}' :(`
      );
      this.error(JSON.stringify(error, null, 2));
    }
  }

  async process(workflowPath: string, outDir?: string): Promise<void> {
    const workflowFilename = path.basename(workflowPath);

    try {
      const workflow = this.loadFile(workflowPath);

      if (!workflow) {
        return;
      }

      this.log(`Processing '${workflowFilename}'...`);

      const outputFolder = outDir
        ? path.resolve(outDir)
        : path.dirname(workflowPath);
      const outputFilename =
        workflow.name ??
        path.basename(workflowPath.replace(/.ya?ml$/i, "")) ??
        "image";
      const outputPath = `${outputFolder}/${outputFilename}.png`;

      const image = await processWorkflow(getDefaultWorkflow(workflow), Jimp);
      this.writeFile(image, outputPath);

      this.log(
        `Successfully processed workflow '${workflowFilename}' and saved to:\n  ✓ ${path.relative(
          "",
          outputPath
        )}`
      );
    } catch (error) {
      this.log(`✗ Couldn't process workflow '${workflowFilename}' :(`);
      this.error(JSON.stringify(error, null, 2));
    }
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
      this.error("✗ Not a valid Base64 image from Rejig.Processing");
    }

    const buffer = Buffer.from(base64Matches[2], "base64");
    fs.writeFileSync(path.resolve(outputPath), buffer);
  }
}
