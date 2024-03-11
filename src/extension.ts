import * as path from 'path';
import * as vscode from 'vscode';
import { TreeDataProvider } from './core/treeDataProvider';
import { createDefaultContextsFile } from './utils/createDefaultContextsFile';
import { registerCommands } from './commands';

export function activate(extension: vscode.ExtensionContext) {

	registerCommands(extension);

	// Watch for changes in the contexts.json file
	const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
	const dataProvider = new TreeDataProvider(workspaceRoot);
	vscode.window.registerTreeDataProvider('contextOrganizerView', dataProvider);

	const configFileWatcher = vscode.workspace.createFileSystemWatcher(path.join(workspaceRoot, '.vscode', 'contexts.json'));
	extension.subscriptions.push(configFileWatcher);

	configFileWatcher.onDidChange(() => {
		dataProvider.refresh();
	});

	// Create default contexts.json file
	if (workspaceRoot) {
		createDefaultContextsFile(workspaceRoot);
	}
}




