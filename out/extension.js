"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const axios_1 = require("axios");
const path = require("path");
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "gptpilot" is now active!');
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("gptpilot.helloWorld", () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage("Hello World from gpt-pilot!");
    });
    let refactorDisposable = vscode.commands.registerCommand("gptpilot.refactorCode", async () => {
        vscode.window.showInformationMessage("refactoringgnngngng!");
        const editor = vscode.window.activeTextEditor;
        console.log('Congratulations, your extension "gpt-pilot" is now active!');
        if (editor) {
            const selectedCode = editor.document.getText(editor.selection);
            const refactoredCode = await refactorCode(selectedCode);
            editor.edit((editBuilder) => {
                editBuilder.replace(editor.selection, refactoredCode);
            });
        }
    });
    let generateTestsDisposable = vscode.commands.registerCommand("gptpilot.generateUnitTests", async () => {
        const editor = vscode.window.activeTextEditor;
        try {
            if (editor) {
                const selectedCode = editor.document.getText(editor.selection);
                // Call a function to generate the unit tests
                const unitTests = await generateUnitTests(selectedCode);
                const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
                const fileName = "unitTest.ts";
                const filePath = path.join(workspaceFolder, fileName);
                // Convert the unit tests to a buffer before writing to the file
                const buffer = Buffer.from(unitTests);
                await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), buffer);
                const uri = vscode.Uri.file(filePath);
                const testDoc = await vscode.workspace.openTextDocument(uri);
                const edit = new vscode.WorkspaceEdit();
                // Insert the unit tests on a new line at the end of the file
                const lastLineEnd = testDoc.lineAt(testDoc.lineCount - 1).range.end;
                edit.insert(uri, lastLineEnd, `\n${unitTests}\n`);
                await vscode.workspace.applyEdit(edit);
            }
        }
        catch (e) {
            throw e;
        }
    });
    context.subscriptions.push(disposable);
    context.subscriptions.push(refactorDisposable);
    context.subscriptions.push(generateTestsDisposable);
}
exports.activate = activate;
async function refactorCode(selectedCode) {
    vscode.window.showInformationMessage("Hello World from gpt-pilot!");
    const apiKey = "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";
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const prompt = `Refactor the following code:\n\n${selectedCode}\n`;
    try {
        const response = await axios_1.default.post(endpoint, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            max_tokens: selectedCode.length + 20,
            n: 1,
        }, { headers: { Authorization: `Bearer ${apiKey}` } });
        console.log(response.data.choices[0].message.content.trim());
        return response.data.choices[0].message.content.trim();
    }
    catch (e) {
        throw e;
    }
}
async function generateUnitTests(selectedCode) {
    vscode.window.showInformationMessage("Hello World from gpt-pilot!");
    const apiKey = "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";
    const endpoint = "https://api.openai.com/v1/chat/completions";
    const editor = vscode.window.activeTextEditor;
    const fileName = editor?.document.fileName;
    console.log(`Current file name: ${fileName}`);
    const posfix = fileName?.split(".").pop();
    const prompt = `respone only in code and comments, Generate 3 unit tests in ${posfix} for the following code consider - as minus:\n\n${selectedCode}\n `;
    console.log(`prompt name: ${prompt}`);
    try {
        5;
        const response = await axios_1.default.post(endpoint, {
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: prompt }],
            n: 1,
            temperature: 0.1,
            max_tokens: 250,
        }, { headers: { Authorization: `Bearer ${apiKey}` } });
        return response.data.choices[0].message.content.trim();
    }
    catch (e) {
        throw e;
    }
}
// This method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map