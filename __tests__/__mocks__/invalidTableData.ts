export const invalidTableData = [
  "any" as any,
  1,
  ["one", "two", "three"],
  undefined,
  null,
  { "I am": "an object" },
  [["sub-arrays"], ["with", "different", "lengths"]],
];

// Array of invalid table options
export const invalidTableOptions = [
  // { optionChecks: 0 }, // number instead of OptionChecks type
  { cellPadding: "2" }, // string instead of number
  { maxColumns: 200 }, // too many columns
  { maxRows: -1 }, // negative number of rows
  { maxRows: 1001 }, // too many rows
  { maxColWidths: false }, // boolean instead of number[] or number
  { maxRowHeight: 100 }, // too large row height
  { header: "true" }, // string instead of boolean
  { colors: "yellow" }, // string instead of object
  {
    colors: {
      borderColor: 1, // not a valid color string
    },
  },
  {
    colors: {
      alternateRows: false, // boolean instead of array
    },
  },
  {
    colors: {
      customColors: 1, // number instead of array
    },
  },
  {
    colors: {
      customColors: [
        {
          column: 160, // Too large column number
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
      sides: "hello", // string instead of BorderSides
    },
  },
  {
    borders: {
      sides: { top: 1 }, // number instead of boolean
    },
  },
  {
    borders: {
      sides: { betweenColumns: {} }, // obj instead of boolean
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
  101,
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
  [{ sides: { top: true } }],
];

export const invalidColorsOption = [
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
  { borderColor: {} },
  { borderColor: 4 },
  { borderColor: ["red"] },
  { alternateRows: {} },
  { alternateRows: 4 },
  { alternateRows: [] },
  { alternateRows: [1] },
  {
    alternateRows: [{ fgColor: [], bgColor: 6, style: { bold: "bold" } }],
  },
  { targetCells: {} },
  { targetCells: 4 },
  { targetCells: ["red"] },
  { targetCells: [] },
  { targetCells: [{ column: -1 }] },
  { targetCells: [{ column: "hello" }] },
  { targetCells: [{ column: true, row: 0 }] },
  { targetCells: [{ column: false, row: 0 }] },
  { targetCells: [{ row: -1, column: 0 }] },
  { targetCells: [{ row: "hello", column: 0 }] },
  { targetCells: [{ row: true }] },
  { targetCells: [{ row: false }] },
  { targetCells: [{ fgColor: "red" }] },
  { targetCells: [{ bgColor: "red" }] },
  { targetCells: [{ style: "bold" }] },
  { targetCells: [{ fgColor: -1, row: 0 }] },
  { targetCells: [{ fgColor: {}, row: 0 }] },
  { targetCells: [{ fgColor: true, row: 0 }] },
  { targetCells: [{ fgColor: false, row: 0 }] },
  { targetCells: [{ bgColor: -1, row: 0 }] },
  { targetCells: [{ bgColor: {}, row: 0 }] },
  { targetCells: [{ bgColor: true, row: 0 }] },
  { targetCells: [{ bgColor: false, row: 0 }] },
  { targetCells: [{ style: -1, column: 0 }] },
  { targetCells: [{ style: {}, column: 0 }] },
  { targetCells: [{ style: true, column: 0 }] },
  { targetCells: [{ style: false, column: 0 }] },
];
