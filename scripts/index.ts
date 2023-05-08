import { BorderGlyphs, PartialTableOptions } from "../src/tableTypes";
import { versitable } from "../src/index";
import { hotkeys } from "../__tests__/__mocks__/hotkeys";
import {
  validTableOptions,
  allBorderCombos,
  validTableData,
} from "../__tests__/__mocks__/validTableData";
import { TABLE_DEFAULTS } from "../src/tableDefaults";
import { Versitable } from "../src/Table";

const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));

function main() {
  const hotkeysFormattedForTable = hotkeys.map((hotkey) => {
    return [hotkey.app, hotkey.hotkey, hotkey.description];
  });
  // versitable.log(hotkeysFormattedForTable, validTableOptions);
  const updatedOptions: PartialTableOptions = {
    ...TABLE_DEFAULTS,
    maxRows: 15,
    maxColumns: 6,
    maxColWidths: [10, 10, 10],
    maxRowHeight: 2,
    cellPadding: 2,
    borders: {
      sides: {
        betweenRows: true,
        betweenColumns: true,
        top: false,
        bottom: true,
        left: true,
        right: true,
      },
    },
  };

  logAllBorderCombos(hotkeysFormattedForTable);

  // console.log("__________________________________________________");
  // console.log("\n\n");
  // const myVersitable = Versitable.make(
  //   hotkeysFormattedForTable,
  //   updatedOptions
  // );
  // myVersitable.print();
}

main();

async function logAllBorderCombos(hotkeysFormattedForTable: string[][]) {
  for (let i = 0; i < allBorderCombos.length - 1; i++) {
    const borderCombo = allBorderCombos[i];
    const borderOptions: PartialTableOptions = {
      ...TABLE_DEFAULTS,
      maxRows: 15,
      maxColWidths: [10, 10, 10],
      maxRowHeight: 2,
      borders: {
        sides: { ...borderCombo },
        glyphs: {
          horizontalLine: "━",
          verticalLine: "┃",
          topLeftCorner: "┏",
          topRightCorner: "┓",
          bottomLeftCorner: "┗",
          bottomRightCorner: "┛",
          topSeparator: "┳",
          bottomSeparator: "┻",
          middleSeparator: "╋",
          rightSeparator: "┫",
          leftSeparator: "┣",
        } as BorderGlyphs,
      },
    };
    const myVersitable = Versitable.make(validTableData, borderOptions);
    myVersitable.print();
    console.log("\n\n\n");
    await sleep(300); // wait 1 second before printing next table
  }
}
