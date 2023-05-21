import {
  Borders,
  CustomStyles,
  PartialTableOptions,
  Styles,
} from "../../src/tableTypes";

export const validTableOptions: PartialTableOptions = {
  optionChecks: "error",
  cellPadding: 1,
  maxColumns: 6,
  maxRows: 8,
  maxColWidths: [30, 30, 60],
  maxRowHeight: 2,
  header: true,
  styles: {
    borderStyle: { fgColor: "#9148d5" },
    rowStyles: [
      { fgColor: "red", bgColor: "blue", modifier: "bold" },
      { fgColor: "#48d0d5", bgColor: "#8342b1", modifier: "italic" },
    ],
    targetCellStyles: [
      {
        column: 0,
        row: 0,
        fgColor: "orange",
        modifier: "bold",
        bgColor: "magenta",
      },
      {
        column: 2,
        row: 1,
        modifier: "italic",
        fgColor: "magentaBright",
        bgColor: "yellowBright",
      },
    ],
  },
  borders: {
    glyphs: {
      horizontalLine: "*",
      verticalLine: "$",
      topLeftCorner: "┌",
      topRightCorner: "┐",
      bottomLeftCorner: "└",
      bottomRightCorner: "┘",
      topSeparator: "┬",
      leftSeparator: "├",
      rightSeparator: "┤",
      bottomSeparator: "┴",
      middleSeparator: "┼",
    },
    sides: {
      top: true,
      bottom: false,
      left: true,
      right: false,
      betweenColumns: true,
      betweenRows: false,
    },
  },
};

export const validCellPaddings = [0, 1, 3, 7, 15, 20];
export const validMaxColumns = [1, 3, 10, 55, 100];
export const validMaxRows = [1, 10, 100, 500, 1000];
export const validMaxColWidths = [
  1,
  10,
  100,
  400,
  [1],
  [1, 2, 3],
  [1, 10, 100, 400],
];
export const validMaxRowHeight = [1, 7, 25, 50];
export const validHeader = [true, false];

export const validBordersOption: Borders[] = [
  {
    glyphs: {
      horizontalLine: "*",
      verticalLine: "$",
      topLeftCorner: "┌",
      topRightCorner: "┐",
      bottomLeftCorner: "└",
      bottomRightCorner: "┘",
      topSeparator: "┬",
      leftSeparator: "├",
      rightSeparator: "┤",
      bottomSeparator: "┴",
      middleSeparator: "┼",
    },
    sides: {
      top: true,
      bottom: false,
      left: true,
      right: false,
      betweenColumns: true,
      betweenRows: false,
    },
  },
  {
    glyphs: {
      middleSeparator: "┼",
    },
    sides: {
      bottom: false,
    },
  },
  {
    glyphs: {
      leftSeparator: "O",
    },
  },
  {
    sides: {
      top: true,
    },
  },
];

export const validStylesOption: Styles[] = [
  true,
  false,
  {
    borderStyle: { fgColor: "#9148d5" },
    rowStyles: [
      { fgColor: "red", bgColor: "blue", modifier: "bold" },
      { fgColor: "#48d0d5", bgColor: "#8342b1", modifier: "italics" },
    ],
    targetCellStyles: [
      {
        column: 0,
        row: 0,
        fgColor: "orange",
        modifier: "bold",
        bgColor: "magenta",
      },
    ],
  },
];

/* Code used to generate the allBorderCombos */
// let sidesCombinations: any = [];

// const sides: Searchable = {
//   betweenRows: true,
//   betweenColumns: true,
//   left: true,
//   right: true,
//   top: true,
//   bottom: true,
// };
// interface Searchable {
//   [key: string]: boolean;
// }
// function generateCombinations(
//   keys: string[],
//   index: number,
//   combination: Searchable,
//   allCombinations: Searchable[]
// ) {
//   if (index === keys.length) {
//     allCombinations.push(combination);
//     return;
//   }

//   const key = keys[index];
//   generateCombinations(
//     keys,
//     index + 1,
//     { ...combination, [key]: true },
//     allCombinations
//   );
//   generateCombinations(
//     keys,
//     index + 1,
//     { ...combination, [key]: false },
//     allCombinations
//   );
// }

// const sidesKeys = Object.keys(sides);
// const uniqueSidesCombinations: Searchable[] = [];
// generateCombinations(sidesKeys, 0, {}, uniqueSidesCombinations);

// console.log(uniqueSidesCombinations);

export const allBorderCombos = [
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: true,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: true,
    left: false,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: true,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: true,
    betweenColumns: false,
    left: false,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: true,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: true,
    left: false,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: true,
    right: false,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: true,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: true,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: true,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: true,
    top: false,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: false,
    top: true,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: false,
    top: true,
    bottom: false,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: false,
    top: false,
    bottom: true,
  },
  {
    betweenRows: false,
    betweenColumns: false,
    left: false,
    right: false,
    top: false,
    bottom: false,
  },
];
