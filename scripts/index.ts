import { BorderGlyphs, PartialTableOptions } from "../src/tableTypes";
import { hotkeys } from "../__tests__/__mocks__/hotkeys";
import {
  allBorderCombos,
  validTableData,
} from "../__tests__/__mocks__/validTableData";
import { TABLE_DEFAULTS } from "../src/tableDefaults";
import { Versitable } from "../src/Table";
import { ColorHelper } from "../src/ColorHelper";

const alternateRows1 = [
  { fgColor: "#e0e0e0", bgColor: "#447c65" },
  { fgColor: "#e0e0e0", bgColor: "#445c7c" },
  { fgColor: "#e0e0e0", bgColor: "#7c5a44" },
  { fgColor: "#e0e0e0", bgColor: "#44737c" },
];
const alternateRows2 = [
  { fgColor: "#1f1f1f", bgColor: "#d6d6d6" },
  // { fgColor: "#1f1f1f", bgColor: "#cbcbcb" },
  { fgColor: "#1f1f1f", bgColor: "#c0c0c0" },
  // { fgColor: "#1f1f1f", bgColor: "#b4b4b4" },
  // { fgColor: "#1f1f1f", bgColor: "#adadad" },
  // { fgColor: "#1f1f1f", bgColor: "#a4a4a4" },
  // { fgColor: "#1f1f1f", bgColor: "#9a9a9a" },
  // { fgColor: "#1f1f1f", bgColor: "#929292" },
  // { fgColor: "#1f1f1f", bgColor: "#878787" },
  // { fgColor: "#1f1f1f", bgColor: "#7e7e7e" },
  // { fgColor: "#1f1f1f", bgColor: "#757575" },
];
const alternateRows3 = [
  // { fgColor: "#cfcfcf", bgColor: "#4b4b4b" },
  { fgColor: "#cfcfcf", bgColor: "#434343" },
  // { fgColor: "#cfcfcf", bgColor: "#3c3c3c" },
  // { fgColor: "#cfcfcf", bgColor: "#373737" },
  { fgColor: "#cfcfcf", bgColor: "#323232" },
  // { fgColor: "#cfcfcf", bgColor: "#2e2e2e" },
  // { fgColor: "#cfcfcf", bgColor: "#292929" },
  // { fgColor: "#cfcfcf", bgColor: "#252525" },
];

const updatedOptions: PartialTableOptions = {
  maxRows: 8,
  maxColumns: 8,
  maxColWidths: [20, 20, 10],
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
    },
  },
  colors: {
    borderColor: { fgColor: "#898989", bgColor: "#434343" },
    alternateRows: alternateRows3,
  },
};

const hotkeysFormattedForTable = hotkeys.map((hotkey) => {
  return [hotkey.app, hotkey.hotkey, hotkey.description];
});

const sleep = (ms = 100) => new Promise((r) => setTimeout(r, ms));

function main() {
  // logAllBorderCombos(hotkeysFormattedForTable);

  // console.table(
  //   validTableData
  //     .splice(0, 10)
  //     .map((row) => row.splice(0, 4).map((cell) => cell.slice(0, 10)))
  // );

  // console.log("__________________________________________________");
  console.log("\n\n\n\n\n\n\n\n");
  const myVersitable = Versitable.make(
    hotkeysFormattedForTable,
    updatedOptions
  );
  myVersitable.print();
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
      colors: {
        alternateRows: alternateRows3,
      },
    };
    const myVersitable = Versitable.make(validTableData, borderOptions);
    myVersitable.print();
    console.log("\n\n\n\n\n\n");
    await sleep(1000); // wait 1 second before printing next table
  }
}
