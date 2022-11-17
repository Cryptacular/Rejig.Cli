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
      expect(ctx.stdout).to.contain("Couldn't process workflow");
    });

  test
    .stdout()
    .command([
      "process",
      "test/data/valid/valid-workflow.yaml",
      "--out=test/data/output",
    ])
    .it("runs command with valid workflow", (ctx) => {
      expect(ctx.stdout).to.contain("Successfully processed workflow");
      expect(ctx.stdout).to.contain("test/data/output/Valid workflow.png");
    });

  test
    .stdout()
    .command([
      "process",
      "test/data/valid/valid-workflow-no-name.yaml",
      "--out=test/data/output",
    ])
    .it("runs command with valid workflow that has no name field", (ctx) => {
      expect(ctx.stdout).to.contain("Successfully processed workflow");
      expect(ctx.stdout).to.contain(
        "test/data/output/valid-workflow-no-name.png"
      );
    });

  test
    .stdout()
    .command(["process", "test/data/valid", "--out=test/data/output"])
    .it("runs command with folder of valid workflows", (ctx) => {
      expect(ctx.stdout).to.contain("test/data/output/Valid workflow.png");
      expect(ctx.stdout).to.contain(
        "test/data/output/valid-workflow-no-name.png"
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
        expect(ctx.stdout).to.contain("Couldn't process workflow");
      }
    );
});
