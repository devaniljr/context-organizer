import * as vscode from 'vscode';
import { createDefaultContextsFile } from './utils/createDefaultContextsFile';
import { registerCommands } from './commands';
import { registerWatchers } from './watchers';

export function activate(extension: vscode.ExtensionContext) {

	registerCommands(extension);

	const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';

	registerWatchers(workspaceRoot, extension);

	// Create default contexts.json file
	if (workspaceRoot) {
		createDefaultContextsFile(workspaceRoot);
	}
}




