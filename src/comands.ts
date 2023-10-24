import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { SimpleDataProvider } from './dataProvider';

export async function showSectionPicker(): Promise<string | undefined> {
	const workspaceRoot = vscode.workspace.rootPath;
	const configPath = path.join(workspaceRoot!, '.vscode', 'contexts.json');

	if (fs.existsSync(configPath)) {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const sections = Object.keys(config.contexts);
		return await vscode.window.showQuickPick(sections, {
			placeHolder: 'Select a context to add the file to'
		});
	} else {
		vscode.window.showErrorMessage('File contexts.json in .vscode folder not found.');
		return undefined;
	}
}

export function addFileToConfig(filePath: string, section: string, dataProvider: SimpleDataProvider) {
	const workspaceRoot = vscode.workspace.rootPath;
	const configPath = path.join(workspaceRoot!, '.vscode', 'contexts.json');

	const relativePath = path.relative(workspaceRoot!, filePath);

	if (fs.existsSync(configPath)) {
		const fileContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

		if (fileContent.contexts[section]) {
			fileContent.contexts[section].push(relativePath);
			fs.writeFileSync(configPath, JSON.stringify(fileContent, null, 4));
			dataProvider.refresh();
		} else {
			vscode.window.showErrorMessage(`Context ${section} not found.`);
		}
	} else {
		vscode.window.showErrorMessage('File contexts.json in .vscode folder not found.');
	}
}

export function createDefaultContextsFile(workspaceRoot: string) {
	const contextsFilePath = path.join(workspaceRoot, '.vscode', 'contexts.json');

	if (!fs.existsSync(contextsFilePath)) {
		const defaultContent = {
			"contexts": {},
			"configs": {
				"showFolders": false
			}
		};

		const vscodeDir = path.join(workspaceRoot, '.vscode');
		if (!fs.existsSync(vscodeDir)) {
			fs.mkdirSync(vscodeDir);
		}

		fs.writeFileSync(contextsFilePath, JSON.stringify(defaultContent, null, 4));
	}
}
