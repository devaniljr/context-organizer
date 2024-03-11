import * as fs from 'fs';
import * as path from 'path';
import { TreeDataProvider, File } from '../core/treeDataProvider';

export async function removeFileFromContextCommand(file: File, dataProvider: TreeDataProvider, workspaceRoot: string) {
    const configPath = path.join(workspaceRoot, '.vscode', 'contexts.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

    for (const context in config.contexts) {
        const index = config.contexts[context].indexOf(path.relative(workspaceRoot, file.filePath));
        if (index > -1) {
            config.contexts[context].splice(index, 1);
            fs.writeFileSync(configPath, JSON.stringify(config, null, 4));
            dataProvider.refresh();
            break;
        }
    }
}
