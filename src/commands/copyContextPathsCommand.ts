import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { Section } from '../core/treeDataProvider'; // Ajuste este import conforme necessário

export async function copyContextPathsCommand(section: Section, workspaceRoot: string) {
    const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    if (config.contexts && config.contexts[section.label as string]) {
        let files: string[] = config.contexts[section.label as string];
        await vscode.env.clipboard.writeText(files.join(os.EOL));
        vscode.window.showInformationMessage("Paths copied to clipboard!");
    }
}
