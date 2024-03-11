
import * as vscode from 'vscode';
import { File } from '../core/treeDataProvider';

export async function addFileToStageCommand(file: File) {
    let success = await vscode.commands.executeCommand('git.stage', file.filePath);
}
