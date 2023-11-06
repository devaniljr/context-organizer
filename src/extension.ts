import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { SimpleDataProvider, File, Section } from './dataProvider';
import { showSectionPicker, addFileToConfig, createDefaultContextsFile } from './comands'
import { SingletonOutputChannel } from './loggerChannel';


export function activate(context: vscode.ExtensionContext) {

	// Button to add file to context
	let addFileToSection = vscode.commands.registerCommand('context-organizer.addToFileSection', async (fileUri: vscode.Uri) => {
		if (fileUri && fileUri.fsPath) {
			const section = await showSectionPicker();
			if (section) {
				addFileToConfig(fileUri.fsPath, section, dataProvider);
			}
		}
	});
	context.subscriptions.push(addFileToSection);


	// Button to add a new context
	vscode.commands.registerCommand('context-organizer.createNewContext', async () => {
		const sectionName = await vscode.window.showInputBox({ prompt: 'Name your new context:' });
		if (sectionName) {
			const configPath = path.join(vscode.workspace.workspaceFolders![0].uri.fsPath, '.vscode', 'contexts.json');
			const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

			config.contexts[sectionName] = [];
			fs.writeFileSync(configPath, JSON.stringify(config, null, 4));

			dataProvider.refresh();
		}
	});

	// Watch for changes in the contexts.json file
	const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
	const dataProvider = new SimpleDataProvider(workspaceRoot);
	vscode.window.registerTreeDataProvider('contextOrganizerView', dataProvider);

	const configFileWatcher = vscode.workspace.createFileSystemWatcher(path.join(workspaceRoot, '.vscode', 'contexts.json'));
	context.subscriptions.push(configFileWatcher);

	configFileWatcher.onDidChange(() => {
		dataProvider.refresh();
	});

	// Create default contexts.json file
	if (workspaceRoot) {
		createDefaultContextsFile(workspaceRoot);
	}

	// Button to remove file from context
	let removeFileFromContext = vscode.commands.registerCommand('context-organizer.removeFromContext', async (file: File) => {
		const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

		for (const context in config.contexts) {
			const index = config.contexts[context].indexOf(path.relative(workspaceRoot, file.filePath));
			if (index > -1) {
				config.contexts[context].splice(index, 1);
				fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
				dataProvider.refresh();
				break;
			}
		}
	});
	context.subscriptions.push(removeFileFromContext);
	SingletonOutputChannel.getInstance();

	// Button to remove a context as a whole
	let removeContextCommand = vscode.commands.registerCommand('context-organizer.removeContext', async (section: Section) => {
		const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

		if (config.contexts && config.contexts[section.label as string]) {
			delete config.contexts[section.label as string];
			fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
			dataProvider.refresh();
		}
	});

	context.subscriptions.push(removeContextCommand);
}

export function deactivate() { }



