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
rejig-cli/0.11.0 darwin-x64 node-v19.6.1
$ rejig --help [COMMAND]
USAGE
  $ rejig COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`rejig help [COMMAND]`](#rejig-help-command)

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
<!-- commandsstop -->
