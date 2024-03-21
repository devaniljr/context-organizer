import * as path from 'path';
import * as fs from 'fs';
import * as vscode from 'vscode';

export class TreeDataProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
	private _items: vscode.TreeItem[] = [];

	constructor(private workspaceRoot: string) {
		this.loadConfig();
	}
	private handleLoadConfig(configPath:string){
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
			const showFolders = config.configs.showFolders;

			for (const sectionName in config.contexts) {
				const sectionItems: Container[] = [];
				for (const filePath of config.contexts[sectionName]) {
					if (showFolders || path.extname(filePath)) {
						this.addToTree(sectionItems, filePath, sectionName);
					}
				}
				this._items.push(new Section(sectionName, sectionItems));
			}
	}
	private loadConfig() {
		this._items = [];
		const configPath = path.join(this.workspaceRoot, '.vscode', 'contexts.json');
		
		if (fs.existsSync(configPath)) {
			try{
				this.handleLoadConfig(configPath);
			}catch(error){
				let message = `Error while reading file ${configPath}, check your file`;
				vscode.window.showErrorMessage(message); //not detailed error
				if (error instanceof SyntaxError){ 
					message = `Error while reading file configPath, details : ${error.message}`;
				}
				vscode.window.showErrorMessage(message);

				
				
			}
		} else {
			vscode.window.showWarningMessage('File contexts.json was not found in the .vscode folder, so it has been created for you.');
		}
	}

	private addToTree(parent: Container[], fullPath: string, contextName: string) {
		const parts = fullPath.split(path.sep);
		let currentLevel: Container[] = parent;
		const configPath = path.join(this.workspaceRoot, '.vscode', 'contexts.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const showFolders = config.configs.showFolders;

		if (showFolders) {
			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				const isFile = i === parts.length - 1;
				let existingItem = currentLevel.find(item => item.label === part);

				if (isFile) {
					if (!existingItem) {
						const file = new File(path.join(this.workspaceRoot, ...parts), contextName);
						currentLevel.push(file);
					}
				} else {
					if (!existingItem) {
						const folder = new Folder(part);
						currentLevel.push(folder);
						currentLevel = folder.children as Container[];
					} else {
						currentLevel = existingItem.children as Container[];
					}
				}
			}
		} else {
			const file = new File(path.join(this.workspaceRoot, ...parts), contextName);
			parent.push(file);
		}
	}

	getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]> {
		if (element instanceof Container) {
			return Promise.resolve(element.children);
		}
		return Promise.resolve(this._items);
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;

	refresh(): void {
		this.loadConfig();
		this._onDidChangeTreeData.fire(undefined);
	}
}

abstract class Container extends vscode.TreeItem {
	children: vscode.TreeItem[] = [];

	constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState) {
		super(label, collapsibleState);
	}
}

export class Section extends Container {
	constructor(label: string, children: vscode.TreeItem[] = []) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
		this.iconPath = {
			light: path.join(__filename, '..', '..', 'resources', 'light', 'contextIcon.svg'),
			dark: path.join(__filename, '..', '..', 'resources', 'dark', 'contextIcon.svg')
		};
		this.children = children;
		this.contextValue = 'section';
	}
}

export class Folder extends Container {
	constructor(label: string) {
		super(label, vscode.TreeItemCollapsibleState.Collapsed);
		this.contextValue = 'folder';
		this.iconPath = new vscode.ThemeIcon('folder');
	}
}

export class File extends Container {
	constructor(public filePath: string, contextName: string) {
		super(path.basename(filePath), vscode.TreeItemCollapsibleState.None);
		this.resourceUri = vscode.Uri.file(filePath);
		this.command = {
			command: 'vscode.open',
			arguments: [this.resourceUri],
			title: 'Open File'
		};
		this.contextValue = 'file';
		this.id = filePath + contextName;
	}
}