import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TreeDataProvider, File, Section } from '../core/treeDataProvider';

export async function addNewContextCommand() {
  const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
  const dataProvider = new TreeDataProvider(workspaceRoot);

  const sectionName = await vscode.window.showInputBox({ prompt: 'Name your new context:' });
		if (sectionName) {
			const configPath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, '.vscode', 'contexts.json');
			const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

			config.contexts[sectionName] = [];
			fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

			dataProvider.refresh();
		}
}
