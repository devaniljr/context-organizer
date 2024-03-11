import * as vscode from 'vscode';
import { showContextPicker } from '../ui/showContextPicker';
import { addFileToConfig } from '../core/addFileToConfig';
import { TreeDataProvider, File, Section } from '../core/treeDataProvider';

export async function addFileToContextCommand(fileUri: vscode.Uri) {
  const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
  const dataProvider = new TreeDataProvider(workspaceRoot);

  if (fileUri && fileUri.fsPath) {
    const context = await showContextPicker();

    if (context) {
      addFileToConfig(fileUri.fsPath, context, dataProvider);
    }
  }
}
