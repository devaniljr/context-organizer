import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export async function showContextPicker(): Promise<string | undefined> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0].uri.fsPath;

    if (!workspaceRoot) {
      vscode.window.showErrorMessage("No workspace is open.");
      return undefined;
    }

    const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');

    if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        const contexts = Object.keys(config.contexts);

        if (contexts.length === 0) {
            let message = 'The contexts.json file does not contain any context. First, create a context to add the selected file.';
            vscode.window.showWarningMessage(message);
            return undefined;
        }

        return await vscode.window.showQuickPick(contexts, {
            placeHolder: 'Select a context to add the file to',
        });
    } else {
        vscode.window.showErrorMessage('The contexts.json file was not found in the .vscode folder.');
        return undefined;
    }
}
