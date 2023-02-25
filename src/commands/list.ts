import fetch from "node-fetch";
import { BaseCommand } from "../base-command";
import { REJIG_BASE_URL } from "../constants";

export default class List extends BaseCommand {
  static description = "List workflows you've published to Rejig";

  static examples = ["$ rejig list"];

  async run(): Promise<void> {
    if (!(await this.isLoggedIn())) {
      this.log("Please log in first");
      await this.loginWithEmail();
    }

    const session = await this.getSession();

    if (!session?.user.id) {
      throw new Error("Couldn't find your user ID");
    }

    const response = await fetch(
      `${REJIG_BASE_URL}/api/user/${session?.user.id}/workflows`
    );

    if (response.ok) {
      this.log(JSON.parse(await response.text()).join("\n"));
      return;
    }

    const body = await response.json();

    this.error(
      `Something went wrong. Status: '${response.status}'. '${body?.message}'`
    );
  }
}
