import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TreeDataProvider } from './treeDataProvider';

export function addFileToConfig(filePath: string, section: string, dataProvider: TreeDataProvider) {
    const workspaceRoot = vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders[0].uri.fsPath : null;
    
    if (!workspaceRoot) {
        vscode.window.showErrorMessage("No workspace is open.");
        return;
    }
    
    const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
    const relativePath = path.relative(workspaceRoot, filePath);

    if (fs.existsSync(configPath)) {
        const fileContent = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

        fileContent.configs = fileContent.configs || {};
        if (typeof fileContent.configs.orderAlphabetically === 'undefined') {
            fileContent.configs.orderAlphabetically = true;
            fs.writeFileSync(configPath, JSON.stringify(fileContent, null, 4));
        }

        const shouldOrderAlphabetically = fileContent.configs?.orderAlphabetically;

        if (!fileContent.contexts[section]) {
            vscode.window.showErrorMessage(`Context ${section} not found.`);
            return;
        }

        if (fileContent.contexts[section].includes(relativePath)) {
            vscode.window.showWarningMessage(`File: ${relativePath} already exists in context ${section}.`);
            return;
        }

        if (shouldOrderAlphabetically) {
            const insertionIndex = fileContent.contexts[section].findIndex((existingFilePath: string) => existingFilePath.localeCompare(relativePath) > 0);
            if (insertionIndex === -1) {
                fileContent.contexts[section].push(relativePath);
            } else {
                fileContent.contexts[section].splice(insertionIndex, 0, relativePath);
            }
        } else {
            fileContent.contexts[section].push(relativePath);
        }

        fs.writeFileSync(configPath, JSON.stringify(fileContent, null, 4));
        dataProvider.refresh();
    } else {
        vscode.window.showErrorMessage('File contexts.json in .vscode folder not found.');
    }
}
