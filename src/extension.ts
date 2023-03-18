import * as vscode from "vscode";
import axios from "axios";
import * as path from "path";
import * as fs from "fs";

export function activate(context: vscode.ExtensionContext) {

  let refactorDisposable = vscode.commands.registerCommand(
    "gptpilot.refactorCode",
    async () => {
      vscode.window.showInformationMessage("Refactoring code...");

      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selectedCode = editor.document.getText(editor.selection);
        const refactoredCode = await refactorCode(selectedCode);
        editor.edit((editBuilder) => {
			 editBuilder.replace(editor.selection, refactoredCode);
			});
      }
    }
  );

  let generateTestsDisposable = vscode.commands.registerCommand(
    "gptpilot.generateUnitTests",
    async () => {
      vscode.window.showInformationMessage("Generating unit tests...");
      const editor = vscode.window.activeTextEditor;
      try {
        if (editor) {
          const selectedCode = editor.document.getText(editor.selection);

          const editorPath = editor?.document.fileName;
          const posfix = editorPath?.split(".").pop();

          const unitTests = await generateUnitTests(selectedCode);

          const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
          const fileName = `unitTest.${posfix}`;
          const filePath = path.join(workspaceFolder, fileName);

          // Convert the unit tests to a buffer before writing to the file
          const buffer = Buffer.from(unitTests);

          await vscode.workspace.fs.writeFile(
            vscode.Uri.file(filePath),
            buffer
          );

        }
      } catch (e) {
        vscode.window.showInformationMessage(
          "There is an error please try again"
        );

        throw e;
      }
    }
  );

  let checkVulnerability = vscode.commands.registerCommand(
    "gptpilot.checkVulnerability",

    async () => {
      vscode.window.showInformationMessage("Checking Vulnerability...");
      const editor = vscode.window.activeTextEditor;

      try {
        if (editor) {
          const selectedCode = editor.document.getText(editor.selection);

          // Call a function to generate the unit tests
          const vulnerabilities = await checkVulnerabiliity(selectedCode);

          const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
          const fileName = `Vulnerabilities.txt`;
          const filePath = path.join(workspaceFolder, fileName);

          // Convert the unit tests to a buffer before writing to the file
          const buffer = Buffer.from(vulnerabilities);

          await vscode.workspace.fs.writeFile(vscode.Uri.file(filePath), buffer);
        }
      } catch (e) {
        vscode.window.showInformationMessage(
          "There is an error please try again"
        );
        throw e;
      }
    }
  );

  context.subscriptions.push(refactorDisposable);
  context.subscriptions.push(generateTestsDisposable);
  context.subscriptions.push(checkVulnerability);
}
async function refactorCode(selectedCode: string): Promise<string> {
  const apiKey = "API Key";
  const endpoint = "https://api.openai.com/v1/chat/completions";

  const prompt = `Respone only in code, Refactor the following code and make clean and simple:\n\n${selectedCode}\n`;

  try {
    const response = await axios.post(
      endpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: selectedCode.length + 20,
        n: 1,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    console.log(response.data.choices[0].message.content.trim());

    return response.data.choices[0].message.content.trim();
  } catch (e) {
    vscode.window.showInformationMessage("There is an error");
    throw e;
  }
}

async function generateUnitTests(selectedCode: string): Promise<string> {
  const apiKey = "API Key";
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const editor = vscode.window.activeTextEditor;
  const fileName = editor?.document.fileName;
  const posfix = fileName?.split(".").pop();
  const prompt = `respone only in code and comments, Generate 3 unit tests in ${posfix} with all the needed imports and file configurations for the following code in the file ${fileName}: \n\n${selectedCode}\n `;
  console.log(`prompt name: ${prompt}`);
  try {
    5;
    const response = await axios.post(
      endpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        n: 1,
        temperature: 0.1,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return response.data.choices[0].message.content.trim();
  } catch (e) {
    vscode.window.showInformationMessage("There is an error");
    throw e;
  }
}

async function checkVulnerabiliity(selectedCode: string): Promise<string> {
  vscode.window.showInformationMessage("Hello World from gpt-pilot!");

  const apiKey = "API Key";
  const endpoint = "https://api.openai.com/v1/chat/completions";
  const prompt = `detect vulnerabilities based on owasp standers without saying As an AI language model... on this code: \n\n${selectedCode}\n `;
  console.log(`prompt name: ${prompt}`);
  try {
    const response = await axios.post(
      endpoint,
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        n: 1,
        temperature: 0.1,
        max_tokens: 250,
      },
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    return response.data.choices[0].message.content.trim();
  } catch (e) {
    vscode.window.showInformationMessage("There is an error");
    throw e;
  }
}

export function deactivate() {}
