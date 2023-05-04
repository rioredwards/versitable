import { TableOptions } from "../src/tableTypes";
import { versitable } from "../src/index";
import { hotkeys } from "../__tests__/fixtures/hotkeys";
import {
  validTableOptions,
  validTableData,
} from "../__tests__/fixtures/validTableData";

function main() {
  const hotkeysFormattedForTable = hotkeys.map((hotkey) => {
    return [hotkey.app, hotkey.hotkey, hotkey.description];
  });
  // versitable.log(hotkeysFormattedForTable, validTableOptions);
  const updatedOptions = {
    ...validTableOptions,
    maxColWidths: [20, 20, 50],
    cellPadding: 3,
  };

  console.log("__________________________________________________");
  versitable.log(validTableData, updatedOptions);
}

main();
