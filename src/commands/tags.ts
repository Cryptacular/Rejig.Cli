import fetch from "node-fetch";
import { BaseCommand } from "../base-command";
import { REJIG_BASE_URL } from "../constants";

export default class Tags extends BaseCommand {
  static description =
    "Lists the tags available for a particular workflow published to Rejig";

  static args = [
    {
      name: "workflow",
      description: "The workflow to inspect tags for",
      required: true,
    },
  ];

  static examples = ["$ rejig tags some-user/some-workflow"];

  async run(): Promise<void> {
    const { args } = await this.parse(Tags);
    const response = await fetch(
      `${REJIG_BASE_URL}/api/user/${args.workflow}/tags`
    );

    const body: Tag[] | ErrorResponse = await response.json();

    if (response.ok) {
      this.log((body as Tag[]).map((tag) => `${tag.name}`).join("\n"));
      return;
    }

    this.error(
      `Something went wrong. Status: '${response.status}'. ${
        (body as ErrorResponse).message || ""
      }`
    );
  }
}

interface Tag {
  id: string;
  name: string;
  workflowId: string;
  created: string;
  modified: string;
  Workflow: {
    id: string;
    userId: string;
    name: string;
    created: string;
    modified: string;
  };
}

interface ErrorResponse {
  message: string;
}
