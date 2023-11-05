import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { SimpleDataProvider } from './dataProvider';
import { SingletonOutputChannel } from './loggerChannel';

export async function showSectionPicker(): Promise<string | undefined> {
	const workspaceRoot = vscode.workspace.rootPath;
	const configPath = path.join(workspaceRoot!, '.vscode', 'contexts.json');

	if (fs.existsSync(configPath)) {
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		 
		const sections = Object.keys(config.contexts);

		if (sections.length===0){
			let message='File contexts.json in .vscode does not contain any folder. Create firsts a folder to add the selected file.';
			SingletonOutputChannel.appendLine(message);

			vscode.window.showWarningMessage(message);
			return undefined;
		}

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
			if (fileContent.contexts[section].includes(relativePath)){
				vscode.window.showWarningMessage(`File:${relativePath} already exists in context ${section}.`);
				return;
			}
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
