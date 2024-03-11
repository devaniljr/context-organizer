import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { TreeDataProvider, Section } from '../core/treeDataProvider'; // Ajuste este import conforme necessário

export async function removeContextCommand(section: Section, workspaceRoot: string, dataProvider: TreeDataProvider) {
    if (typeof section.label !== 'string') {
        vscode.window.showErrorMessage('The context label is not valid.');
        return;
    }

    const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    if (config.contexts && config.contexts.hasOwnProperty(section.label)) {
        let files = config.contexts[section.label];
        if (files.length > 0) {
            let answer = await vscode.window.showInformationMessage(`Are you sure you want to delete the "${section.label}" context? This action is irreversible.`, "Yes", "No");
            if (answer === 'No') {
                return;
            }
        }

        delete config.contexts[section.label];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        dataProvider.refresh();
    } else {
        vscode.window.showErrorMessage(`The context "${section.label}" does not exist.`);
    }
}
