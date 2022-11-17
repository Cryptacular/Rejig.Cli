import { Command, Flags } from "@oclif/core";
import { processWorkflow } from "@Cryptacular/rejig.processing";
import * as Jimp from "jimp";
import * as yaml from "js-yaml";
import fs from "node:fs";
import path from "node:path";
import {
  Workflow,
  getDefaultWorkflow,
} from "@Cryptacular/rejig.processing/lib/models/Workflow";

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

    this.log(`Processing ${args.workflow}...`);

    const workflow = yaml.load(
      fs.readFileSync(path.resolve(args.workflow), "utf-8")
    ) as Workflow;

    try {
      const image = await processWorkflow(getDefaultWorkflow(workflow), Jimp);
      const base64Matches = image.match(/^data:([+/A-Za-z-]+);base64,(.+)$/);

      if (!base64Matches) {
        this.error("Something went wrong :(");
      }

      const buffer = Buffer.from(base64Matches[2], "base64");
      const outputFolder = flags.out
        ? path.resolve(flags.out)
        : path.dirname(args.workflow);
      const outputFilename =
        workflow.name ??
        path.basename((args.workflow as string).replace(/.ya?ml$/i, "")) ??
        "image";
      const outputPath = `${outputFolder}/${outputFilename}.png`;

      if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder);
      }

      fs.writeFileSync(path.resolve(outputPath), buffer);

      console.log(
        `Successfully processed workflow and saved to:\n${outputPath}`
      );
    } catch (error) {
      console.log("Couldn't process workflow :(");
      this.error(JSON.stringify(error, null, 2));
    }
  }
}
