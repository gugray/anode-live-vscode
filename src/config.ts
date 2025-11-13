import * as vscode from "vscode";

const getConfiguration = vscode.workspace.getConfiguration;
const configSection = "anode";

export const feedbackColor = () => {
  return getConfiguration(configSection).get("feedbackColor", "rgba(100, 250, 100, 0.3)");
};

export const relayUrl = (): string | null => {
  return getConfiguration(configSection).get("relayUrl", null);
};

export const relaySecret = (): string | null => {
  return getConfiguration(configSection).get("relaySecret", null);
};
