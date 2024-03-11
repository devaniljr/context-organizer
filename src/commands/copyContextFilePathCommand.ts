import * as vscode from 'vscode';
import * as path from 'path';
import { File } from '../core/treeDataProvider';

export async function copyContextFilePathCommand(file: File) {
    let relativeFilePath = vscode.workspace.workspaceFolders ? path.relative(vscode.workspace.workspaceFolders[0].uri.fsPath, file.filePath) : file.filePath;
    await vscode.env.clipboard.writeText(relativeFilePath);
    vscode.window.showInformationMessage(`Path: ${relativeFilePath} copied to clipboard!`);
}
