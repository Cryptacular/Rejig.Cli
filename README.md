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
rejig-cli/0.10.0 darwin-x64 node-v16.6.2
$ rejig --help [COMMAND]
USAGE
  $ rejig COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`rejig help [COMMAND]`](#rejig-help-command)
* [`rejig list`](#rejig-list)
* [`rejig login`](#rejig-login)
* [`rejig logout`](#rejig-logout)
* [`rejig process WORKFLOW`](#rejig-process-workflow)
* [`rejig pull WORKFLOW`](#rejig-pull-workflow)
* [`rejig push WORKFLOW NAME`](#rejig-push-workflow-name)
* [`rejig tags WORKFLOW`](#rejig-tags-workflow)

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

## `rejig list`

List workflows you've published to Rejig

```
USAGE
  $ rejig list

DESCRIPTION
  List workflows you've published to Rejig

EXAMPLES
  $ rejig list
```

_See code: [dist/commands/list.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/list.ts)_

## `rejig login`

Log in to your Rejig account

```
USAGE
  $ rejig login

DESCRIPTION
  Log in to your Rejig account
```

_See code: [dist/commands/login.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/login.ts)_

## `rejig logout`

Log out of your Rejig account

```
USAGE
  $ rejig logout

DESCRIPTION
  Log out of your Rejig account
```

_See code: [dist/commands/logout.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/logout.ts)_

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

_See code: [dist/commands/process.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/process.ts)_

## `rejig pull WORKFLOW`

Pull down a workflow manifest to your machine.

```
USAGE
  $ rejig pull [WORKFLOW]

ARGUMENTS
  WORKFLOW  Name of the workflow to pull down, e.g. 'workflow-name'. Can optionally also specify a tag, eg.
            'workflow-name:tag'. If not specified, the tag defaults to 'latest'

DESCRIPTION
  Pull down a workflow manifest to your machine.

EXAMPLES
  $ rejig pull my-custom-workflow

  $ rejig pull my-custom-workflow:1.0.0
```

_See code: [dist/commands/pull.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/pull.ts)_

## `rejig push WORKFLOW NAME`

Push a workflow to Rejig so that it can be published and used by others. Format is '<workflow-name>:<tag>', e.g. 'rounded-corners:v1.0.0'

```
USAGE
  $ rejig push [WORKFLOW] [NAME]

ARGUMENTS
  WORKFLOW  Workflow file to push
  NAME      Name of the workflow. Should be in kebab-case (all lowercase), e.g. 'workflow-name'. Can optionally also
            specify a tag, eg. 'workflow-name:tag'. If not specified, the tag defaults to 'latest'

DESCRIPTION
  Push a workflow to Rejig so that it can be published and used by others. Format is '<workflow-name>:<tag>', e.g.
  'rounded-corners:v1.0.0'

EXAMPLES
  $ rejig push workflow.yaml my-custom-workflow

  $ rejig push workflow.yaml my-custom-workflow:1.0.0
```

_See code: [dist/commands/push.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/push.ts)_

## `rejig tags WORKFLOW`

Lists the tags available for a particular workflow published to Rejig

```
USAGE
  $ rejig tags [WORKFLOW]

ARGUMENTS
  WORKFLOW  The workflow to inspect tags for

DESCRIPTION
  Lists the tags available for a particular workflow published to Rejig

EXAMPLES
  $ rejig tags some-workflow
```

_See code: [dist/commands/tags.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.10.0/dist/commands/tags.ts)_
<!-- commandsstop -->
