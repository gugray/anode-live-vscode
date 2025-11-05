import {commands, ExtensionContext} from "vscode";
import {quit} from "./relay";
import {evalMultiCommand} from "./evalCommands";

export const activate = (context: ExtensionContext) => {
  const evalMultiCommandRegistered = commands.registerCommand("anode.evalMulti", evalMultiCommand);

  context.subscriptions.push(evalMultiCommandRegistered);
};

export function deactivate() {
  quit();
}
