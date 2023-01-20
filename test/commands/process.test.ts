import { expect, test } from "@oclif/test";

describe("process", () => {
  test
    .stdout()
    .command([
      "process",
      "test/data/invalid/invalid-workflow.yaml",
      "--out=test/data/output",
    ])
    .exit(2)
    .it("throws error with invalid workflow", (ctx) => {
      expect(ctx.stdout).to.contain(
        "Workflow 'invalid-workflow.yaml' is not valid!"
      );
    });

  test
    .stdout()
    .command([
      "process",
      "test/data/valid/valid-workflow.yaml",
      "--out=test/data/output",
    ])
    .it("runs command with valid workflow with YAML extension", (ctx) => {
      expect(ctx.stdout).to.contain("✔ Validate workflow");
      expect(ctx.stdout).to.contain("✔ Process workflow");
      expect(ctx.stdout).to.contain("✔ Save image");
    });

  test
    .stdout()
    .command([
      "process",
      "test/data/valid/valid-workflow.yml",
      "--out=test/data/output",
    ])
    .it("runs command with valid workflow with YML extension", (ctx) => {
      expect(ctx.stdout).to.contain("✔ Validate workflow");
      expect(ctx.stdout).to.contain("✔ Process workflow");
      expect(ctx.stdout).to.contain("✔ Save image");
    });

  test
    .stdout()
    .command([
      "process",
      "test/data/valid/valid-workflow.json",
      "--out=test/data/output",
    ])
    .it("runs command with valid workflow with JSON extension", (ctx) => {
      expect(ctx.stdout).to.contain("✔ Validate workflow");
      expect(ctx.stdout).to.contain("✔ Process workflow");
      expect(ctx.stdout).to.contain("✔ Save image");
    });

  test
    .stdout()
    .command([
      "process",
      "test/data/valid/valid-workflow-no-name.yaml",
      "--out=test/data/output",
    ])
    .it("runs command with valid workflow that has no name field", (ctx) => {
      expect(ctx.stdout).to.contain("✔ Validate workflow");
      expect(ctx.stdout).to.contain("✔ Process workflow");
      expect(ctx.stdout).to.contain("✔ Save image");
    });

  test
    .stdout()
    .command(["process", "test/data/valid", "--out=test/data/output"])
    .it("runs command with folder of valid workflows", (ctx) => {
      expect(ctx.stdout).to.contain(
        "✔ Process workflows in directory 'test/data/valid'"
      );
    });

  test
    .stdout()
    .stderr()
    .command([
      "process",
      "test/data/invalid/valid-workflow-with-missing-image.yaml",
      "--out=test/data/output",
    ])
    .exit(2)
    .it(
      "throws error when processing a workflow with a missing image",
      (ctx) => {
        expect(ctx.stdout).to.contain("no such file or directory");
        expect(ctx.stdout).to.contain(
          "'./test/data/assets/image-that-doesnt-exist.jpg'"
        );
      }
    );
});
