import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Section, TreeDataProvider } from '../core/treeDataProvider';

export async function renameContextCommand(section: Section, dataProvider: TreeDataProvider, workspaceRoot: string) {
    const sectionName = await vscode.window.showInputBox({ prompt: `New name for your context: ${section.label}` });
    if (!sectionName) {
        return;
    }
    const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    if (config.contexts && config.contexts[section.label as string]) {
        config.contexts[sectionName] = config.contexts[section.label as string];
        delete config.contexts[section.label as string];
        fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
        dataProvider.refresh();
    }
}
