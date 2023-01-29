import fetch from "node-fetch";
import { BaseCommand } from "../base-command";
import { REJIG_BASE_URL } from "../constants/urls";

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

  static examples = ["$ rejig tags some-workflow"];

  async run(): Promise<void> {
    const { args } = await this.parse(Tags);
    const response = await fetch(
      `${REJIG_BASE_URL}/api/user/${args.workflow}/tags`
    );

    const body = await response.json();

    if (response.ok) {
      this.log(body.join("\n"));
      return;
    }

    this.error(
      `Something went wrong. Status: '${response.status}'. ${
        body?.message || ""
      }`
    );
  }
}
