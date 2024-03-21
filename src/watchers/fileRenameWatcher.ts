import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TreeDataProvider } from '../core/treeDataProvider';

export function fileRenameWatcher(workspaceRoot: string, dataProvider: TreeDataProvider) {
  vscode.window.registerTreeDataProvider('contextOrganizerView', dataProvider);
  
  let disposable = vscode.workspace.onWillRenameFiles(event => {
    event.files.forEach(({ oldUri, newUri }) => {
      const oldFilePath = oldUri.fsPath.replace(workspaceRoot, '').replace(/\\/g, '/').slice(1);
      const newFilePath = newUri.fsPath.replace(workspaceRoot, '').replace(/\\/g, '/').slice(1);

      updateContextsJsonOnRename(workspaceRoot, oldFilePath, newFilePath);

      dataProvider.refresh();
    });
  });

  return disposable;
}

function updateContextsJsonOnRename(workspaceRoot: string, oldFilePath: string, newFilePath: string) {
  const contextsPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
  fs.readFile(contextsPath, (err, data) => {
    if (err) {
      console.error('Failed to read contexts.json:', err);
      return;
    }

    let contexts = JSON.parse(data.toString());
    Object.keys(contexts.contexts).forEach(context => {
      const index = contexts.contexts[context].indexOf(oldFilePath);
      if (index !== -1) {
        contexts.contexts[context][index] = newFilePath;
      }
    });

    fs.writeFile(contextsPath, JSON.stringify(contexts, null, 2), err => {
      if (err) {
        console.error('Failed to write to contexts.json:', err);
      }
    });
  });
}
