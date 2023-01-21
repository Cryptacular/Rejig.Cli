/* eslint-disable unicorn/prefer-json-parse-buffer */
import fs from "node:fs";
import path from "node:path";
import * as yaml from "js-yaml";
import { CliUx, Command } from "@oclif/core";
import { createClient, Session } from "@supabase/supabase-js";
import { Workflow } from "rejig-processing/lib/models/Workflow";

export abstract class BaseCommand extends Command {
  static globalFlags = {};

  protected async isLoggedIn(): Promise<boolean> {
    return (await this.getSession()) !== null;
  }

  protected async getSession(): Promise<Session | null> {
    const cache = this.getCache();

    if (cache.session) {
      const client = getClient();
      try {
        const response = await client.auth.setSession(cache.session);
        if (response.data.session) {
          this.storeInCache({ session: response.data.session });
          return response.data.session;
        }
      } catch {
        return null;
      }
    }

    return null;
  }

  protected async loginWithEmail(): Promise<Session> {
    const cache = this.getCache();

    const email = await CliUx.ux.prompt("Email", { default: cache.email });
    const password = await CliUx.ux.prompt("Password", { type: "hide" });

    this.storeInCache({ email });

    const client = getClient();
    const response = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (response.error) {
      this.error(`Could not log in: ${response.error.message}`);
    }

    if (!response.data.session) {
      this.error("Could not log in...");
    }

    this.storeInCache({ session: response.data.session });
    return response.data.session;
  }

  protected async logOut(): Promise<void> {
    const session = await this.getSession();

    if (session === null) {
      return;
    }

    const client = getClient();
    client.auth.signOut();

    this.storeInCache({ session: null });
  }

  protected loadWorkflowFile(workflowPath: string): Workflow | void {
    const workflowFilename = path.basename(workflowPath);
    const lowercaseFile = workflowPath.toLocaleLowerCase();

    const isYaml =
      lowercaseFile.endsWith(".yml") || lowercaseFile.endsWith(".yaml");
    const isJson = lowercaseFile.endsWith(".json");

    if (!isYaml && !isJson) {
      throw new Error(`Workflow '${workflowFilename}' is not YAML or JSON!`);
    }

    const doesFileExist = fs.existsSync(path.resolve(workflowPath));

    if (!doesFileExist) {
      throw new Error(`Workflow '${workflowFilename}' does not exist!`);
    }

    if (isYaml) {
      return (
        (yaml.load(
          fs.readFileSync(path.resolve(workflowPath), "utf-8")
        ) as Workflow) || {}
      );
    }

    if (isJson) {
      return (
        (JSON.parse(
          fs.readFileSync(path.resolve(workflowPath), "utf-8")
        ) as Workflow) || {}
      );
    }
  }

  protected getCache(): Cache {
    const dir = this.config.cacheDir;
    const cachePath = path.join(dir, cacheFileName);

    try {
      return JSON.parse(fs.readFileSync(cachePath, "utf-8"));
    } catch {
      return {};
    }
  }

  protected storeInCache(properties: Partial<Cache>): void {
    const dir = this.config.cacheDir;
    const cachePath = path.join(dir, cacheFileName);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }

    if (!fs.existsSync(cachePath)) {
      fs.writeFileSync(cachePath, "{}");
    }

    const cache: Cache = this.getCache();
    const updatedCache: Cache = { ...cache, ...properties };

    fs.writeFileSync(cachePath, JSON.stringify(updatedCache, null, 2), "utf-8");
  }
}

const cacheFileName = "cache.json";

interface Cache {
  email?: string;
  session?: Session | null;
}

const getClient = () => {
  return createClient(
    "https://rtvflcioatnrdqlvxonx.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0dmZsY2lvYXRucmRxbHZ4b254Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzA4OTk1MjksImV4cCI6MTk4NjQ3NTUyOX0.zJaRjmwgtuO-QbdkpBs_9M9LN9rYPVoBmS74xpArVtw"
  );
};
