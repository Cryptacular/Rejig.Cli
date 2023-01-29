import Listr from "listr";
import fetch from "node-fetch";
import path from "node:path";
import { validate, Workflow } from "rejig-processing/lib/models/Workflow";
import { BaseCommand } from "../base-command";
import { REJIG_BASE_URL } from "../constants/urls";

export default class Push extends BaseCommand {
  static description =
    "Push a workflow to Rejig so that it can be published and used by others. Format is '<workflow-name>:<tag>', e.g. 'rounded-corners:v1.0.0'";

  static args = [
    {
      name: "workflow",
      description: "Workflow file to push",
      required: true,
    },
    {
      name: "name",
      description:
        "Name of the workflow. Should be in kebab-case (all lowercase), e.g. 'workflow-name'. Can optionally also specify a tag, eg. 'workflow-name:tag'. If not specified, the tag defaults to 'latest'",
      required: true,
    },
  ];

  static examples = [
    "$ rejig push workflow.yaml my-custom-workflow",
    "$ rejig push workflow.yaml my-custom-workflow:1.0.0",
  ];

  async run(): Promise<void> {
    const { args } = await this.parse(Push);

    if (!(await this.isLoggedIn())) {
      this.log("Please log in first");
      await this.loginWithEmail();
    }

    const { workflow, name } = args;

    const push = async (manifest: Workflow) => {
      const session = await this.getSession();

      const response = await fetch(`${REJIG_BASE_URL}/api/workflow`, {
        method: "POST",
        body: JSON.stringify({
          name,
          refreshToken: session?.refresh_token,
          workflow: manifest,
        }),
        headers: { Authorization: `Bearer ${session?.access_token}` },
      });

      if (response.ok) {
        this.log(JSON.parse(response.body.read() as string).message);
        return;
      }

      this.error(
        `Something went wrong. Status: '${response.status}'. '${
          JSON.parse(response.body.read() as string).message
        }'`
      );
    };

    new Listr([
      {
        title: "Validate workflow",
        task: async (ctx) => {
          const manifest = this.loadWorkflowFile(path.resolve(workflow));
          await validate(manifest);
          ctx.manifest = manifest;
        },
      },
      {
        title: "Push workflow to Rejig",
        async task(ctx) {
          const { manifest } = ctx;
          await push(manifest);
        },
      },
    ]).run();
  }
}
