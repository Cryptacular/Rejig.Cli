import fs from "node:fs";
import fetch from "node-fetch";
import { BaseCommand } from "../base-command";
import { REJIG_BASE_URL } from "../constants/urls";
import Listr from "listr";

export default class Pull extends BaseCommand {
  static description = "Pull down a workflow manifest to your machine.";

  static args = [
    {
      name: "workflow",
      description:
        "Name of the workflow to pull down, e.g. 'workflow-name'. Can optionally also specify a tag, eg. 'workflow-name:tag'. If not specified, the tag defaults to 'latest'",
      required: true,
    },
  ];

  static examples = [
    "$ rejig pull my-custom-workflow",
    "$ rejig pull my-custom-workflow:1.0.0",
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(Pull);

    new Listr([
      {
        title: "Fetch workflow",
        task: async (ctx) => {
          const response = await fetch(
            `${REJIG_BASE_URL}/api/user/${args.workflow}/manifest`
          );

          if (!response.ok) {
            const body = await response.json();
            throw new Error(
              `Something went wrong. Status: '${response.status}'. ${
                body?.message || ""
              }`
            );
          }

          ctx.response = response;
        },
      },
      {
        title: `Save to disk`,
        task: async (ctx) => {
          const [workflowName, workflowTag] = hasWorkflowNameGotTag(
            args.workflow
          )
            ? args.workflow.split(":")
            : [args.workflow, "latest"];

          const baseFolder = `${this.config.cacheDir}/workflows/${workflowName}`;
          const filePath = `${baseFolder}/${workflowTag}.json`;

          const manifest = await ctx.response.text();

          fs.mkdirSync(baseFolder, { recursive: true });
          fs.writeFileSync(filePath, manifest, "utf-8");
        },
      },
    ]).run();
  }
}

const hasWorkflowNameGotTag = (name: string): boolean => name.includes(":");
