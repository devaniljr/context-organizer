<p align="center">
  <br />
  <a title="Learn more about Context Organizer" href="https://github.com/devaniljr/context-organizer"><img src="https://i.imgur.com/tttuG3d.png" alt="Context Organizer Logo" width="50%" /></a>
</p>

Tired of getting lost in projects where the files that matter are in folders far apart from each other? Context Organizer lets you organize your files by context, allowing you to navigate through your current work context in an organized way.

![context-organizer](https://github.com/devaniljr/context-organizer/assets/7834279/ef0ac99b-d361-4aa3-839c-8cf0b8eeaaf8)

## Features

1. You can choose to show folders tree or only the files name:

![folder-files](https://github.com/devaniljr/context-organizer/assets/7834279/23e8ad64-86fe-48cf-932f-7c996fd972c9)


2. **Add to context**: Right-click on any file in the explorer or in the tab and select `Add to context...` to add it to a specific context.
  
2. **New Context**: Click on the `New Context` button in the "Contexts" panel to create a new context.
  
3. **Remove from context**: Right-click on any file within a context in the "Contexts" pane and select `Remove from context` to remove it.

4. **Copy Contents from Context**: Useful for AI purposes, you can copy all content from the files context to clipboard.

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

### `orderAlphabetically`

If set to true, new files will be added in alphabetically order.

## Known Issues

- Ensure the `.vscode` folder exists in your workspace root. If not, the extension will create it.

## Feedback

If you have suggestions or issues, please [open an issue](https://github.com/devaniljr/context-organizer).
