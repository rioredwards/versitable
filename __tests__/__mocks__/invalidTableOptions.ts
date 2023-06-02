// Array of invalid table options
export const invalidTableOptions = [
  // { optionChecks: 0 }, // number instead of OptionChecks type
  { cellPadding: "2" }, // string instead of number
  { maxColumns: 400 }, // too many columns
  { maxRows: -1 }, // negative number of rows
  { maxRows: 1001 }, // too many rows
  { maxColWidths: false }, // boolean instead of number[] or number
  { maxRowHeight: 100 }, // too large row height
  { header: "hello" }, // string instead of array
  { styles: "yellow" }, // string instead of object
  {
    styles: {
      borderStyle: 1, // not a valid styleObj
    },
  },
  {
    styles: {
      rowStyle: false, // boolean instead of array
    },
  },
  {
    styles: {
      headerStyle: false, // boolean instead of array
    },
  },
  {
    styles: {
      targetCellStyle: 1, // number instead of array
    },
  },
  {
    styles: {
      targetCellStyle: [
        {
          column: -1, // negative column number
        },
      ],
    },
  },
  {
    borders: "hello", // string instead of Borders type
  },
  {
    borders: {}, // empty object instead of Borders type
  },
  {
    borders: {
      glyphs: "hello", // string instead of BorderGlyphs
    },
  },
  {
    borders: {
      glyphs: {
        horizontalLine: 1, // number instead of string
      },
    },
  },
  {
    borders: {
      positions: "hello", // string instead of BorderPositions object
    },
  },
  {
    borders: {
      positions: { top: 1 }, // number instead of boolean
    },
  },
  {
    borders: {
      positions: { betweenColumns: {} }, // obj instead of boolean
    },
  },
  {
    borders: {
      positions: { underHeader: "yes" }, // string instead of boolean
    },
  },
];

export const invalidCellPaddings = [
  -1,
  -100,
  21,
  100,
  true,
  "",
  "hello",
  "10",
  { foo: "bar" },
  [],
  [1],
];

export const invalidMaxColumns = [
  -1,
  -100,
  0,
  301,
  true,
  "",
  "hello",
  "10",
  { foo: "bar" },
  [],
  [1],
];

export const invalidMaxRows = [
  -1,
  -100,
  0,
  1001,
  true,
  "",
  "hello",
  "10",
  { foo: "bar" },
  [],
  [1],
];

export const invalidMaxColWidths = [
  -1,
  -100,
  0,
  401,
  [],
  [-1],
  [0],
  true,
  "",
  "hello",
  "10",
  { foo: "bar" },
];

export const invalidMaxRowHeight = [
  -1,
  -100,
  0,
  51,
  [],
  [-1],
  [0],
  true,
  "",
  "hello",
  "10",
  { foo: "bar" },
];

export const invalidHeader = [
  -1,
  0,
  51,
  [],
  [-1],
  [0],
  "",
  "hello",
  "10",
  { foo: "bar" },
  [-1, 0, 1],
  [true, false, true],
];

export const invalidBordersOption = [
  -1,
  0,
  51,
  [],
  [-1],
  [0],
  "",
  "hello",
  "10",
  { foo: "bar" },
  [{ foo: "bar" }],
  [{ positions: { top: true } }],
];

export const invalidStylesOption = [
  -1,
  0,
  51,
  [],
  [-1],
  [0],
  "",
  "hello",
  "10",
  { foo: "bar" },
  [{ foo: "bar" }],
  { borderStyle: {} },
  { borderStyle: 4 },
  { borderStyle: ["red"] },
  { rowStyle: {} },
  { rowStyle: 4 },
  { rowStyle: [] },
  { rowStyle: [1] },
  {
    rowStyle: [{ fgColor: [], bgColor: 6, style: { bold: "bold" } }],
  },
  { headerStyle: {} },
  { targetCellStyles: 4 },
  { rowStyle: ["red"] },
  { headerStyle: [] },
  { targetCellStyles: [{ column: -1 }] },
  { borderStyle: [{ column: "hello" }] },
  { headerStyle: [{ column: true, row: 0 }] },
  { targetCellStyles: [{ column: false, row: 0 }] },
  { rowStyle: [{ row: -1, column: 0 }] },
  { targetCellStyles: [{ row: "hello", column: 0 }] },
  { targetCellStyles: [{ row: true }] },
  { headerStyle: [{ row: false }] },
  { rowStyle: [{ fgColor: "red" }] },
  { targetCellStyles: [{ bgColor: "red" }] },
  { borderStyle: [{ modifier: "bold" }] },
  { rowStyle: [{ fgColor: -1, row: 0 }] },
  { targetCellStyles: [{ fgColor: {}, row: 0 }] },
  { rowStyle: [{ fgColor: true, row: 0 }] },
  { headerStyle: [{ fgColor: false, row: 0 }] },
  { targetCellStyles: [{ bgColor: -1, row: 0 }] },
  { borderStyle: [{ bgColor: {}, row: 0 }] },
  { targetCellStyles: [{ bgColor: true, row: 0 }] },
  { headerStyle: [{ bgColor: false, row: 0 }] },
  { targetCellStyles: [{ modifier: -1, column: 0 }] },
  { rowStyle: [{ modifier: {}, column: 0 }] },
  { targetCellStyles: [{ modifier: true, column: 0 }] },
  { borderStyle: [{ modifier: false, column: 0 }] },
];
