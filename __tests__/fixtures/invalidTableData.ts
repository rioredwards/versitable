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
  { cellPadding: "2" }, // string instead of number
  { maxColumns: 200 }, // too many columns
  { maxRows: -1 }, // negative number of rows
  { maxRows: 1001 }, // too many rows
  { maxColWidths: false }, // boolean instead of number[] or number
  { maxRowHeight: 100 }, // too large row height
  { topAndBottomBorder: 1 }, // number instead of boolean
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
    borders: {
      horizontalLine: "hello", // string instead of character
    },
  },
];
