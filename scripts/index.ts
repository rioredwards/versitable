import { BorderGlyphs, PartialTableOptions } from "../src/tableTypes";
import { versitable } from "../src/index";
import { hotkeys } from "../__tests__/__mocks__/hotkeys";
import {
  validTableOptions,
  allBorderCombos,
} from "../__tests__/__mocks__/validTableData";
import { TABLE_DEFAULTS } from "../src/tableDefaults";

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
    maxColWidths: [8, 10, 10],
    maxRowHeight: 2,
    cellPadding: 5,
    borders: {
      sides: {
        betweenRows: true,
      },
    },
  };

  logAllBorderCombos(hotkeysFormattedForTable);

  // console.log("__________________________________________________");
  console.log("\n\n");
  // const table = versitable.create(hotkeysFormattedForTable, updatedOptions);
  // versitable.log(table);
}

main();

async function logAllBorderCombos(hotkeysFormattedForTable: string[][]) {
  for (let i = 0; i < allBorderCombos.length - 1; i++) {
    const borderCombo = allBorderCombos[i];
    const borderOptions: any = {
      ...TABLE_DEFAULTS,
      maxRows: 15,
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
    const table = versitable.create(hotkeysFormattedForTable, borderOptions);
    versitable.log(table);
    console.log("\n\n\n");
    await sleep(300); // wait 1 second before printing next table
  }
}
