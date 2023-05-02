import { hotkeys } from "../mocks/hotkeys.js";
import { TableOptions } from "../src/tableTypes.js";
import { versitable } from "../src/index.js";
import { User, users } from "../mocks/faker.js";

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

  let usersFormattedForTable: User[][] = [];
  for (const user of users) {
    for (const [_, value] of Object.entries(user)) {
      usersFormattedForTable.push(value);
    }
  }

  versitable.log(usersFormattedForTable, tableOptions);
  // versitable.log(hotkeysFormattedForTable, tableOptions);
}

main();
