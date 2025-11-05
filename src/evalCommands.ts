import {send} from "./relay";
import {getExpression} from "./getExpression";
import {updateStatus} from "./status";

export const evalMultiCommand = () => {
  const input = getExpression(true);
  if (!input) {
    return;
  }
  updateStatus(input);
  send(input);
};
