import * as vscode from 'vscode';


export class SingletonOutputChannel {
    private static instance: vscode.OutputChannel;
 
    private constructor() { }
 
    public static getInstance(): vscode.OutputChannel {
        if (!SingletonOutputChannel.instance) {
            SingletonOutputChannel.instance = vscode.window.createOutputChannel("context-organizer");
            SingletonOutputChannel.instance.show();

        }

        return SingletonOutputChannel.instance;
    }

    public static appendLine(value:string){
        if (!this.instance){
            SingletonOutputChannel.getInstance();
        }
        const timestamp = new Date().toISOString();        
        this.instance.appendLine(`${timestamp} - ${value}`);        	
    }
     
}
