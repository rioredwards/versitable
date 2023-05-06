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
  const updatedOptions: TableOptions = {
    ...validTableOptions,
    maxRows: 15,
    maxColumns: 6,
    maxColWidths: [38, 40],
    maxRowHeight: 2,
    cellPadding: 2,
    borders: true,
  };

  // console.log("__________________________________________________");
  console.log("\n\n");
  versitable.log(hotkeysFormattedForTable, updatedOptions);
}

main();
