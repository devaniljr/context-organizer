import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { File, Folder, Section } from '../core/treeDataProvider';

async function processItem(item: vscode.TreeItem, combinedContents: string): Promise<string> {
  const workspaceFolders = vscode.workspace.workspaceFolders;
  const basePath = workspaceFolders ? workspaceFolders[0].uri.fsPath : '';

  if (item instanceof File) {
      const filePath = item.filePath;

      const relativePath = basePath ? path.relative(basePath, filePath) : filePath;
      const content = fs.readFileSync(filePath, 'utf8');

      combinedContents += `<< ${relativePath} >>\n${content}\n\n`;
  } else if (item instanceof Folder) {

    for (const child of item.children) {
          combinedContents = await processItem(child, combinedContents);
      }
  }
  return combinedContents;
}

export async function copyContextContentsCommand(section: Section) {
  let combinedContents = '';

  if (!section.children || section.children.length === 0) {
      vscode.window.showWarningMessage("No files in context to copy.");
      return;
  }

  for (const item of section.children) {
      if (item instanceof File) {
          if (!fs.existsSync(item.filePath)) {
              vscode.window.showWarningMessage(`File ${item.label} has been deleted.`);
          }
      }
  }

  for (const item of section.children) {
      combinedContents = await processItem(item, combinedContents);
  }

  if (combinedContents) {
      await vscode.env.clipboard.writeText(combinedContents);
      vscode.window.showInformationMessage("Contents copied to clipboard!");
  } else {
      vscode.window.showErrorMessage("No contents found to copy.");
  }
}
