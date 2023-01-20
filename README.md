# Rejig CLI

Command Line Interface for Rejig to process image editing workflows.

See [Rejig.Processing](https://github.com/Cryptacular/Rejig.Processing) for more details on the workflow schema. You can reference the schema from JSON or YAML files like this:

```json
{
  "$schema": "https://raw.githubusercontent.com/Cryptacular/Rejig.Processing/master/json-schema/workflow.json"
}
```

...or in YAML:

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/Cryptacular/Rejig.Processing/master/json-schema/workflow.json
```

**Table of Contents**

<!-- toc -->
* [Rejig CLI](#rejig-cli)
* [yaml-language-server: $schema=https://raw.githubusercontent.com/Cryptacular/Rejig.Processing/master/json-schema/workflow.json](#yaml-language-server-schemahttpsrawgithubusercontentcomcryptacularrejigprocessingmasterjson-schemaworkflowjson)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g rejig-cli
$ rejig COMMAND
running command...
$ rejig (--version)
rejig-cli/0.6.0 darwin-x64 node-v16.6.2
$ rejig --help [COMMAND]
USAGE
  $ rejig COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`rejig help [COMMAND]`](#rejig-help-command)
* [`rejig process WORKFLOW`](#rejig-process-workflow)

## `rejig help [COMMAND]`

Display help for rejig.

```
USAGE
  $ rejig help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for rejig.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.18/src/commands/help.ts)_

## `rejig process WORKFLOW`

Process one or more workflows in YAML or JSON format, then output an image.

```
USAGE
  $ rejig process [WORKFLOW] [-w] [-o <value>]

ARGUMENTS
  WORKFLOW  Workflow or folder of workflows to process

FLAGS
  -o, --out=<value>  Specify folder to write images to. Defaults to the folder the workflow is in.
  -w, --watch        Watch workflow files for changes and re-process them when they do.

DESCRIPTION
  Process one or more workflows in YAML or JSON format, then output an image.

EXAMPLES
  $ rejig process workflow.yaml
```

_See code: [dist/commands/process.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.6.0/dist/commands/process.ts)_
<!-- commandsstop -->
