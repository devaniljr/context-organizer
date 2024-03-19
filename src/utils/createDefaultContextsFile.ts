import * as path from 'path';
import * as fs from 'fs';

export function createDefaultContextsFile(workspaceRoot: string) {
	const contextsFilePath = path.join(workspaceRoot, '.vscode', 'contexts.json');

	if (!fs.existsSync(contextsFilePath)) {
		const defaultContent = {
			"contexts": {},
			"configs": {
				"showFolders": false,
				"orderAlphabetically": true
			}
		};

		const vscodeDir = path.join(workspaceRoot, '.vscode');
		if (!fs.existsSync(vscodeDir)) {
			fs.mkdirSync(vscodeDir);
		}

		fs.writeFileSync(contextsFilePath, JSON.stringify(defaultContent, null, 4));
	}
}
