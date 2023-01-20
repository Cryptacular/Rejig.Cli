# Rejig CLI

Command Line Interface for Rejig to process image editing workflows.

See [Rejig.Processing](https://github.com/Cryptacular/Rejig.Processing) for more details on the workflow schema.

**Table of Contents**

<!-- toc -->
* [Rejig CLI](#rejig-cli)
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
rejig-cli/0.1.0 darwin-x64 node-v16.6.2
$ rejig --help [COMMAND]
USAGE
  $ rejig COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`rejig help [COMMAND]`](#rejig-help-command)
* [`rejig plugins`](#rejig-plugins)
* [`rejig plugins:install PLUGIN...`](#rejig-pluginsinstall-plugin)
* [`rejig plugins:inspect PLUGIN...`](#rejig-pluginsinspect-plugin)
* [`rejig plugins:install PLUGIN...`](#rejig-pluginsinstall-plugin-1)
* [`rejig plugins:link PLUGIN`](#rejig-pluginslink-plugin)
* [`rejig plugins:uninstall PLUGIN...`](#rejig-pluginsuninstall-plugin)
* [`rejig plugins:uninstall PLUGIN...`](#rejig-pluginsuninstall-plugin-1)
* [`rejig plugins:uninstall PLUGIN...`](#rejig-pluginsuninstall-plugin-2)
* [`rejig plugins update`](#rejig-plugins-update)
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

## `rejig plugins`

List installed plugins.

```
USAGE
  $ rejig plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ rejig plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.1.6/src/commands/plugins/index.ts)_

## `rejig plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ rejig plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ rejig plugins add

EXAMPLES
  $ rejig plugins:install myplugin 

  $ rejig plugins:install https://github.com/someuser/someplugin

  $ rejig plugins:install someuser/someplugin
```

## `rejig plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ rejig plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ rejig plugins:inspect myplugin
```

## `rejig plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ rejig plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ rejig plugins add

EXAMPLES
  $ rejig plugins:install myplugin 

  $ rejig plugins:install https://github.com/someuser/someplugin

  $ rejig plugins:install someuser/someplugin
```

## `rejig plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ rejig plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ rejig plugins:link myplugin
```

## `rejig plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ rejig plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ rejig plugins unlink
  $ rejig plugins remove
```

## `rejig plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ rejig plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ rejig plugins unlink
  $ rejig plugins remove
```

## `rejig plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ rejig plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ rejig plugins unlink
  $ rejig plugins remove
```

## `rejig plugins update`

Update installed plugins.

```
USAGE
  $ rejig plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `rejig process WORKFLOW`

Process a workflow in YAML format

```
USAGE
  $ rejig process [WORKFLOW] [-o <value>]

ARGUMENTS
  WORKFLOW  Workflow or folder of workflows to process

FLAGS
  -o, --out=<value>  Specify folder to write images to. Defaults to the folder the workflow is in.

DESCRIPTION
  Process a workflow in YAML format

EXAMPLES
  $ rejig process workflow.yaml
```

_See code: [dist/commands/process/index.ts](https://github.com/Cryptacular/Rejig.Cli/blob/v0.1.0/dist/commands/process/index.ts)_
<!-- commandsstop -->
