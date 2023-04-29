import { hotkeys } from "../testData/hotkeys.js";
import { TableOptions } from "../src/tableTypes.js";
import { versitable } from "../src/index.js";

function main() {
  const hotkeysFormattedForTable = hotkeys.map((hotkey) => {
    return [hotkey.app, hotkey.hotkey, hotkey.description];
  });

  const tableOptions: TableOptions = {
    cellPadding: 1,
    maxColumns: 2,
    maxRows: 8,
    maxColWidths: [20, 20, 60],
    maxRowHeight: 2,
    topAndBottomBorder: false,
    header: true,
    colors: {
      borderColor: "yellow",
      alternateRows: ["red", "blue"],
      customColors: [
        {
          column: 0,
          row: 0,
          fgColor: "orange",
          style: "bold",
          bgColor: "magenta",
        },
        {
          column: 2,
          row: 1,
          style: "italic",
          fgColor: "magentaBright",
          bgColor: "yellowBright",
        },
      ],
    },
  };

  versitable.log(hotkeysFormattedForTable, tableOptions);
}

main();
