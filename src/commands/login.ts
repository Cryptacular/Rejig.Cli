import { BaseCommand } from "../base-command";

export default class Login extends BaseCommand {
  static description = "Log in to your Rejig account";

  async run(): Promise<void> {
    if (await this.isLoggedIn()) {
      this.log("Already logged in :)");
      this.exit();
    }

    await this.loginWithEmail();
    this.log("Successfully logged in!");
  }
}
