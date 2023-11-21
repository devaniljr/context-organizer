import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';
import { SimpleDataProvider, File, Section } from './dataProvider';
import { showSectionPicker, addFileToConfig, createDefaultContextsFile } from './comands'
import { SingletonOutputChannel } from './loggerChannel';
import * as os from 'os';


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
	// Button to add to stage stack (git)
	let addFileToStageFromContext = vscode.commands.registerCommand('context-organizer.addToStage', async (file: File) => {

		let success = await vscode.commands.executeCommand('git.stage', file.filePath);

	});
	context.subscriptions.push(addFileToStageFromContext);
	SingletonOutputChannel.getInstance();


	// Button to copy relative path (if possible): 
	let copyContextFilePath = vscode.commands.registerCommand('context-organizer.copyRelativePathToClipboard', async (file: File) => {
		 
		let relativeFilePath=vscode.workspace.workspaceFolders ? path.relative(vscode.workspace.workspaceFolders[0].uri.fsPath,file.filePath):file.filePath;
		await vscode.env.clipboard.writeText(relativeFilePath);
		vscode.window.showInformationMessage(`Path: ${relativeFilePath} copied to clipboard!`);


	});
	context.subscriptions.push(copyContextFilePath);

	// Button to rename a context
	let renameContextCommand = vscode.commands.registerCommand('context-organizer.renameContext', async (section: Section) => {
		const sectionName = await vscode.window.showInputBox({ prompt: `New name for your context :${section.label}` });
		if (!sectionName) {
			return;
		}
		const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

		if (config.contexts && config.contexts[section.label as string]) {
			config.contexts[sectionName] = [];
			config.contexts[sectionName]= config.contexts[section.label as string];
			delete config.contexts[section.label as string];
			fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
			dataProvider.refresh();
		}
	});
	context.subscriptions.push(renameContextCommand);

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

	// Button to copy all files path context
	let copyContextPathsCommand = vscode.commands.registerCommand('context-organizer.copyContextPaths', async (section: Section) => {		
		const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

		if (config.contexts && config.contexts[section.label as string]) {
			
			let files:string[]= config.contexts[section.label as string];
			await vscode.env.clipboard.writeText(files.join(os.EOL));
			vscode.window.showInformationMessage("Paths copied to clipboard!");
		}
	});

	context.subscriptions.push(copyContextPathsCommand);
	
}

export function deactivate() { }



