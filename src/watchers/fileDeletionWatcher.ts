import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TreeDataProvider } from '../core/treeDataProvider';

export function fileDeletionWatcher(workspaceRoot: string, dataProvider: TreeDataProvider) {
  vscode.window.registerTreeDataProvider('contextOrganizerView', dataProvider);

  const fileWatcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceRoot, '**/*'));
  fileWatcher.onDidDelete(uri => {
    const filePath = uri.fsPath.replace(workspaceRoot, '').replace(/\\/g, '/').slice(1);
    updateContextsJsonOnDeletion(workspaceRoot, filePath);
    dataProvider.refresh();
  });

  return fileWatcher;
}

function updateContextsJsonOnDeletion(workspaceRoot: string, deletedFilePath: string) {
  const contextsPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
  fs.readFile(contextsPath, (err, data) => {
    let contexts = JSON.parse(data.toString());
    Object.keys(contexts.contexts).forEach(context => {
      const index = contexts.contexts[context].indexOf(deletedFilePath);
      if (index !== -1) {
        contexts.contexts[context].splice(index, 1);
      }
    });

    fs.writeFile(contextsPath, JSON.stringify(contexts, null, 2), err => {});
  });
}
