import * as fs from 'fs';
import * as vscode from 'vscode';
import { addFileToContextCommand } from './addFileToContextCommand';
import { addNewContextCommand } from './addNewContextCommand';
import { TreeDataProvider, File, Section } from '../core/treeDataProvider';
import { removeFileFromContextCommand } from './removeFileFromContextCommand';
import { addFileToStageCommand } from './addFileToStageCommand';
import { copyContextFilePathCommand } from './copyContextFilePathCommand';
import { renameContextCommand } from './renameContextCommand';
import { removeContextCommand } from './removeContextCommand';
import { copyContextPathsCommand } from './copyContextPathsCommand';
import { copyContextContentsCommand } from './copyContextContentsCommand';

export function registerCommands(extension: vscode.ExtensionContext) {
  let workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : '';
  let dataProvider = new TreeDataProvider(workspaceRoot);

  // Button to add a a file to a context
  let addFileToContextDisposable = vscode.commands.registerCommand('context-organizer.addToFileSection', (fileUri: vscode.Uri) => {
    addFileToContextCommand(fileUri);
  });
  extension.subscriptions.push(addFileToContextDisposable);

  // Button to add a new context
  let addNewContextDisposable = vscode.commands.registerCommand('context-organizer.createNewContext', () => {
    addNewContextCommand();
  });
  extension.subscriptions.push(addNewContextDisposable);

  let removeFileFromContextDisposable = vscode.commands.registerCommand('context-organizer.removeFromContext', (file: File) => {
    removeFileFromContextCommand(file, dataProvider, workspaceRoot);
  });
  extension.subscriptions.push(removeFileFromContextDisposable);

  let addFileToStageFromContextDisposable = vscode.commands.registerCommand('context-organizer.addToStage', async (file: File) => {
    addFileToStageCommand(file);
  });
  extension.subscriptions.push(addFileToStageFromContextDisposable);

  let copyContextFilePathDisposable = vscode.commands.registerCommand('context-organizer.copyRelativePathToClipboard', async (file: File) => {
    copyContextFilePathCommand(file);
  });
  extension.subscriptions.push(copyContextFilePathDisposable);


  let renameContextDisposable = vscode.commands.registerCommand('context-organizer.renameContext', async (section: Section) => {
    renameContextCommand(section, dataProvider, workspaceRoot);
  });
  extension.subscriptions.push(renameContextDisposable);

  let removeContextDisposable = vscode.commands.registerCommand('context-organizer.removeContext', (section: Section) => {
    removeContextCommand(section, workspaceRoot, dataProvider);
  });
  extension.subscriptions.push(removeContextDisposable);

  let copyContextPathsDisposable = vscode.commands.registerCommand('context-organizer.copyContextPaths', async (section: Section) => {
    copyContextPathsCommand(section, workspaceRoot);
  });
  extension.subscriptions.push(copyContextPathsDisposable);

  let copyContextContentsDisposable = vscode.commands.registerCommand('context-organizer.copyContextContents', async (section: Section) => {
    copyContextContentsCommand(section);
  });
  extension.subscriptions.push(copyContextContentsDisposable);

}