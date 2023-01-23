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

    if (response.ok) {
      this.log(JSON.parse(response.body.read() as string).join("\n"));
      return;
    }

    this.error(
      `Something went wrong. Status: '${response.status}'. ${
        JSON.parse(response.body.read() as string)?.message || ""
      }`
    );
  }
}
