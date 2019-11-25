// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "dynatrace-message-reader" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.dynatraceMessageReader', () => {
		// Get the active text editor
		let editor = vscode.window.activeTextEditor;

		if (editor) {
			let document = editor.document;
			let selection = editor.selection;

			// Get the word within the selection
			let selectedText = document.getText(selection);
			let clearText = selectedText
			clearText = selectedText.replace(/[\n\r\t]*/gm,"")
			clearText = clearText.replace("<?xml version=\"1.0\" encoding=\"utf-8\"?>","")
			clearText = clearText.replace("<user_action_purepath_execution_tree>","")
			clearText = clearText.replace("</user_action_purepath_execution_tree>","")
			clearText = clearText.replace(/<nodeinfo level="1" node="/gim,"")
			clearText = clearText.replace(/" error_type="" detail="" exec_total_ms="-" elapsed_time_ms="\d*\.0" timeline=""\/>/gim,"")
			clearText = unescapeHTML(clearText)
			// if(contentArray == null){
			// 	vscode.window.showInformationMessage('Data not recognized. Select the entire text and try again.');
			// 	return;
			// }

			// let clearText = ""
			// contentArray.forEach(element => {
			// 	clearText = clearText.concat(element)
			// });

			editor.edit(editBuilder => {
				editBuilder.replace(selection, clearText);
			});
		}
		else{
			vscode.window.showInformationMessage('Please select an editor in order to use this command');
		}


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}


let htmlEntities = new Map();
 
//Set entries
htmlEntities.set("Lokesh", 37);

htmlEntities.set("nbsp", ' ');
htmlEntities.set("cent", '¢');
htmlEntities.set("pound", '£');
htmlEntities.set("yen", '¥');
htmlEntities.set("euro", '€');
htmlEntities.set("copy", '©');
htmlEntities.set("reg", '®');
htmlEntities.set("lt", '<');
htmlEntities.set("gt", '>');
htmlEntities.set("quot", '"');
htmlEntities.set("amp", '&');
htmlEntities.set("apos", '\'');


function unescapeHTML(str: String) {
    return str.replace(/\&([^;]+);/g, function (entity, entityCode) {
        var match;

        if (htmlEntities.has(entityCode)) {
			return htmlEntities.get(entityCode);     
            /*eslint no-cond-assign: 0*/
        } else if (match = entityCode.match(/^#x([\da-fA-F]+)$/)) {
            return String.fromCharCode(parseInt(match[1], 16));
            /*eslint no-cond-assign: 0*/
        } else if (match = entityCode.match(/^#(\d+)$/)) {
            return String.fromCharCode(~~match[1]);
        } else {
            return entity;
        }
    });
};
