import { Command, Flags } from "@oclif/core";
import { processWorkflow } from "rejig-processing";
import * as Jimp from "jimp";
import * as yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import {
  Workflow,
  getDefaultWorkflow,
} from "rejig-processing/lib/models/Workflow";

export default class Process extends Command {
  static description = "Process a workflow in YAML format";

  static examples = [`$ rejig process workflow.yaml`];

  static flags = {
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
      const filesInDir = fs
        .readdirSync(args.workflow)
        .filter(
          (f) =>
            f.toLocaleLowerCase().endsWith(".yml") ||
            f.toLocaleLowerCase().endsWith(".yaml")
        );

      await Promise.all(
        filesInDir.map((file) =>
          this.process(path.resolve(args.workflow, file), flags.out)
        )
      );
    } else {
      await this.process(args.workflow, flags.out);
    }
  }

  async process(workflowPath: string, outDir?: string): Promise<void> {
    const workflowFilename = path.basename(workflowPath);

    try {
      this.log(`Processing '${workflowFilename}'...`);

      const workflow = yaml.load(
        fs.readFileSync(path.resolve(workflowPath), "utf-8")
      ) as Workflow;

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

      console.log(
        `Successfully processed workflow '${workflowFilename}' and saved to:\n  > ${path.relative(
          "",
          outputPath
        )}`
      );
    } catch (error) {
      console.log(`Couldn't process workflow '${workflowFilename}' :(`);
      this.error(JSON.stringify(error, null, 2));
    }
  }

  writeFile(image: string, outputPath: string): void {
    const outputFolder = path.dirname(outputPath);
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder);
    }

    const base64Matches = image.match(/^data:([+/A-Za-z-]+);base64,(.+)$/);
    if (!base64Matches) {
      this.error("Something went wrong :(");
    }

    const buffer = Buffer.from(base64Matches[2], "base64");
    fs.writeFileSync(path.resolve(outputPath), buffer);
  }
}
