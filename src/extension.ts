import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    console.log('FireRule Guard is activating...');

    const diagnosticCollection = vscode.languages.createDiagnosticCollection('firestore-rules');

    // 1. REGISTER THE COMMAND (This fixes the "Command Not Found" error)
    let disposable = vscode.commands.registerCommand('firestore-rules-helper.generateRules', async () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('FireRule Guard: No workspace folder open.');
            return;
        }

        const workspaceRoot = workspaceFolders[0].uri.fsPath;
        const rulesPath = path.join(workspaceRoot, 'firestore.rules');

        vscode.window.showInformationMessage('FireRule Guard: Scanning codebase for collections...');

        try {
            // Use your logic to generate the rules string
            const generatedRules = await generateRulesFromCodebase(workspaceRoot);

            // Write the file
            fs.writeFileSync(rulesPath, generatedRules);
            
            // Open the file so the user can see it
            const doc = await vscode.workspace.openTextDocument(rulesPath);
            await vscode.window.showTextDocument(doc);
            
            vscode.window.showInformationMessage('FireRule Guard: firestore.rules has been updated!');
        } catch (error) {
            vscode.window.showErrorMessage(`Error generating rules: ${error}`);
        }
    });

    // 2. REGISTER THE LINTER (Diagnostics)
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument(e => updateDiagnostics(e.document, diagnosticCollection)),
        vscode.workspace.onDidOpenTextDocument(doc => updateDiagnostics(doc, diagnosticCollection)),
        vscode.languages.registerCodeActionsProvider('firestore-rules', new SecurityFixer(), {
            providedCodeActionKinds: [vscode.CodeActionKind.QuickFix]
        }),
        disposable,
        diagnosticCollection
    );

    console.log('FireRule Guard is now active!');
}

// --- YOUR EXISTING LOGIC (INTEGRATED) ---

export async function generateRulesFromCodebase(workspaceRoot: string | undefined): Promise<string> {
    if (!workspaceRoot) return "// Error: No workspace folder open.";

    const collectionNames = new Set<string>();
    const files = await vscode.workspace.findFiles('**/*.{ts,js,tsx,jsx}', '**/node_modules/**');
    const collectionPattern = /\.collection\(["'](?<name>[\w-]+)["']\)/g;

    for (const file of files) {
        const content = fs.readFileSync(file.fsPath, 'utf-8');
        let match;
        while ((match = collectionPattern.exec(content)) !== null) {
            const collectionName = match.groups?.name;
            if (collectionName) collectionNames.add(collectionName);
        }
    }

    return generateRulesString(Array.from(collectionNames));
}

function generateRulesString(collections: string[]): string {
    let rules = `rules_version = '2';\nservice cloud.firestore {\n  match /databases/{database}/documents {\n\n`;

    if (collections.length === 0) {
        rules += `    // No collection usages were found in the codebase.\n`;
    } else {
        for (const collection of collections) {
            rules += `    match /${collection}/{documentId} {\n`;
            rules += `      allow read: if request.auth != null;\n`;
            rules += `      allow write: if false; // WARNING: Review and update this rule!\n`;
            rules += `    }\n\n`;
        }
    }

    rules += `  }\n}`;
    return rules;
}

// --- LINTER & QUICK FIX LOGIC ---

function updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {
    if (!document.fileName.endsWith('firestore.rules')) return;
    const diagnostics: vscode.Diagnostic[] = [];
    const text = document.getText();
    const insecurePattern = /allow\s+read,\s*write:\s*if\s+true;/g;

    let match;
    while ((match = insecurePattern.exec(text)) !== null) {
        const range = new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + match[0].length));
        diagnostics.push(new vscode.Diagnostic(range, "⚠️ CRITICAL: Database is open to the world!", vscode.DiagnosticSeverity.Error));
    }
    collection.set(document.uri, diagnostics);
}

export class SecurityFixer implements vscode.CodeActionProvider {
    public provideCodeActions(document: vscode.TextDocument, range: vscode.Range): vscode.CodeAction[] {
        const line = document.lineAt(range.start.line).text;
        if (!line.includes('if true;')) return [];

        const fix = new vscode.CodeAction('🔒 Secure rule (Require Authentication)', vscode.CodeActionKind.QuickFix);
        fix.edit = new vscode.WorkspaceEdit();
        fix.edit.replace(document.uri, range, "allow read, write: if request.auth != null;");
        return [fix];
    }
}

export function deactivate() {}