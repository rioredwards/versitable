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
    maxRows: 10,
    maxColWidths: 24,
    maxRowHeight: 1,
    cellPadding: 2,
  };

  console.log("__________________________________________________");
  versitable.log(validTableData, updatedOptions);
}

main();
