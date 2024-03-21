import * as path from 'path';
import * as vscode from 'vscode';
import { TreeDataProvider } from '../core/treeDataProvider';
import { fileDeletionWatcher } from './fileDeletionWatcher';
import { fileRenameWatcher } from './fileRenameWatcher';

export function registerWatchers(workspaceRoot: string, extension: any) {
  const dataProvider = new TreeDataProvider(workspaceRoot);
  vscode.window.registerTreeDataProvider('contextOrganizerView', dataProvider);

  const configFileWatcher = vscode.workspace.createFileSystemWatcher(path.join(workspaceRoot, '.vscode', 'contexts.json'));
  extension.subscriptions.push(configFileWatcher);

  configFileWatcher.onDidChange(() => {
    dataProvider.refresh();
  });

  const fileDeletionWatcherTemp = fileDeletionWatcher(workspaceRoot, dataProvider);
  const fileRenameWatcherTemp = fileRenameWatcher(workspaceRoot, dataProvider);
  
  extension.subscriptions.push(fileDeletionWatcherTemp, fileRenameWatcherTemp);
}
