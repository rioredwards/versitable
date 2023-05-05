import { TableOptions } from "../src/tableTypes";
import { versitable } from "../src/index";
import { hotkeys } from "../__tests__/__mocks__/hotkeys";
import {
  validTableOptions,
  validTableData,
} from "../__tests__/__mocks__/validTableData";

function main() {
  const hotkeysFormattedForTable = hotkeys.map((hotkey) => {
    return [hotkey.app, hotkey.hotkey, hotkey.description];
  });
  // versitable.log(hotkeysFormattedForTable, validTableOptions);
  const updatedOptions = {
    ...validTableOptions,
    maxColWidths: 24,
    cellPadding: 2,
  };

  console.log("__________________________________________________");
  // benchmark test
  performance.now();
  versitable.log(validTableData, updatedOptions);
}

main();
