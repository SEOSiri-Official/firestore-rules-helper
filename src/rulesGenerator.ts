import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Scans the project for collections and generates a starter rules file.
 */
export async function generateRulesFromCodebase(workspaceRoot: string | undefined): Promise<string> {
    if (!workspaceRoot) {
        return "// Error: No workspace folder open.";
    }

    const collectionNames = new Set<string>();

    // Search for all TypeScript/JavaScript files, excluding node_modules
    const files = await vscode.workspace.findFiles('**/*.{ts,js,tsx,jsx}', '**/node_modules/**');

    // This regex looks for `.collection('collection-name')`
    const collectionPattern = /\.collection\(["'](?<name>[\w-]+)["']\)/g;

    for (const file of files) {
        const content = fs.readFileSync(file.fsPath, 'utf-8');
        let match;

        // Find all matches of the pattern in the file content
        while ((match = collectionPattern.exec(content)) !== null) {
            const collectionName = match.groups?.name;
            if (collectionName) {
                collectionNames.add(collectionName);
            }
        }
    }

    // Convert the set of found collections into the actual rules string
    return generateRulesString(Array.from(collectionNames));
}


function generateRulesString(collections: string[]): string {
    if (collections.length === 0) {
        return `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n    // No collection usages were found in the codebase.\n  }\n}`;
    }
    
    // Basic template for the generated rules
    let rules = `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n\n`;

    for (const collection of collections) {
        // Default rule: Authenticated users can read, no one can write (this is a safe default)
        rules += `    match /${collection}/{documentId} {\n`;
        rules += `      allow read: if request.auth != null;\n`;
        rules += `      allow write: if false; // WARNING: Review and update this rule!\n`;
        rules += `    }\n\n`;
    }

    rules += `  }\n}`;
    return rules;
}