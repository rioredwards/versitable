import { BorderGlyphs, PartialTableOptions } from "../src/tableTypes";
import { hotkeys } from "../__tests__/__mocks__/hotkeys";
import {
  allBorderCombos,
  validTableData,
} from "../__tests__/__mocks__/validTableData";
import { TABLE_DEFAULTS } from "../src/tableDefaults";
import { Versitable } from "../src/Table";
import { ColorHelper } from "../src/ColorHelper";

const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));

function main() {
  const hotkeysFormattedForTable = hotkeys.map((hotkey) => {
    return [hotkey.app, hotkey.hotkey, hotkey.description];
  });
  const updatedOptions: PartialTableOptions = {
    maxRows: 7,
    maxColumns: 8,
    maxColWidths: [20, 30, 10],
    maxRowHeight: 3,
    cellPadding: 2,
    borders: {
      sides: {
        betweenRows: true,
        betweenColumns: true,
        top: true,
        bottom: true,
        left: true,
        right: true,
      },
    },
    colors: {
      borderColor: { fgColor: "#a7a7a7" },
      alternateRows: [
        { fgColor: "#e0e0e0", bgColor: "#795335" },
        { fgColor: "#e0e0e0", bgColor: "#357079" },
        { fgColor: "#e0e0e0", bgColor: "#2c4c65" },
        { fgColor: "#e0e0e0", bgColor: "#384b6b" },
      ],
    },
  };

  // logAllBorderCombos(hotkeysFormattedForTable);

  // console.table(
  //   validTableData
  //     .splice(0, 10)
  //     .map((row) => row.splice(0, 4).map((cell) => cell.slice(0, 10)))
  // );

  // console.log("__________________________________________________");
  console.log("\n\n\n\n\n\n\n\n");
  const myVersitable = Versitable.make(validTableData, updatedOptions);
  myVersitable.print();
  // const color1 = "rgb(255, 225, 0)";
  // const color2 = "#ff3c3c";
  // const averageColor = ColorHelper.calcAvgColor(color1, color2);
  // console.log("color1: ", ColorHelper.createStyledString(color1, color1));
  // console.log("color2: ", ColorHelper.createStyledString(color2, color2));
  // console.log(
  //   "averageColor: ",
  //   ColorHelper.createStyledString(averageColor, averageColor)
  // );
}

main();

async function logAllBorderCombos(hotkeysFormattedForTable: string[][]) {
  for (let i = 0; i < allBorderCombos.length - 1; i++) {
    const borderCombo = allBorderCombos[i];
    const borderOptions: PartialTableOptions = {
      ...TABLE_DEFAULTS,
      maxRows: 8,
      maxColWidths: [6, 10, 6],
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
    console.log("\n\n\n\n\n\n");
    await sleep(300); // wait 1 second before printing next table
  }
}
