import {relayUrl, relaySecret} from "./config";
import {info, error} from "./logger";

export const send = (command: string) => {
  info("Sending command to relay");

  const url = relayUrl();
  const secret = relaySecret();
  const data = {command, secret, source: "js"};

  if (url && url.startsWith("http")) {
    fetch(url, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(data),
    }).catch((err) => {
      error(`Relay to ${url} failed: ${err}`);
    });
  }
};

export const quit = () => {};
