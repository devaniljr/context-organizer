# Context Organizer for VS Code

Organize your files within Visual Studio Code into contexts, giving you a more organized view of your project structure.

![context-organizer](https://github.com/devaniljr/context-organizer/assets/7834279/ef0ac99b-d361-4aa3-839c-8cf0b8eeaaf8)

## How to Use

1. **Add to context**: Right-click on any file in the explorer and select `Add to context...` to add it to a specific context.
  
2. **New Context**: Click on the `New Context` button in the "Contexts" panel to create a new context.
  
3. **Remove from context**: Right-click on any file within a context in the "Contexts" pane and select `Remove from context` to remove it.

## Installation

1. Open Visual Studio Code.
2. Go to Extensions.
3. Search for "Context Organizer".
4. Install the extension.

## Requirements

- VS Code version: ^1.83.0

## Extension Settings

You can configure the extension settings by changing the `.vscode/contexts.json` file in your workspace root.

### `contexts`

The file contains an array of contexts. Each context has a `name` and an array of `files` that are automatically set with the UI.

### `showFolders`

You can choose to show or hide the folders in the "Contexts" pane by setting the `showFolders` property to `true` or `false`.

## Known Issues

- Ensure the `.vscode` folder exists in your workspace root. If not, the extension will create it.

## Release Notes

### 0.0.1

Initial release of Context Organizer.

## Feedback

If you have suggestions or issues, please [open an issue](https://github.com/devaniljr/context-organizer).
