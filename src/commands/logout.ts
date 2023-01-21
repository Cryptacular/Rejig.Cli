import { BaseCommand } from "../base-command";

export default class Logout extends BaseCommand {
  static description = "Log out of your Rejig account";

  async run(): Promise<void> {
    if (!(await this.isLoggedIn())) {
      this.log("Already logged out :)");
      this.exit();
    }

    await this.logOut();

    this.log("Successfully logged out!");
  }
}
