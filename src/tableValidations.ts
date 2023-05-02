import chalkPipe = require("chalk-pipe");
import { Borders, Colors, CustomColors, TableOptions } from "./tableTypes.js";

/* Helper functions for ensuring data integrity */
function subArraysAreSameLength(table: any[][]) {
  const firstLength = table[0].length;

  for (let i = 1; i < table.length; i++) {
    if (table[i].length !== firstLength) {
      return false;
    }
  }

  return true;
}

function isValidCellPadding(cellPadding: number) {
  return cellPadding >= 0 && cellPadding <= 10;
}

function isValidMaxColumns(maxColumns: number) {
  return maxColumns > 0 && maxColumns <= 100;
}

function isValidMaxRows(maxRows: number) {
  return maxRows > 0 && maxRows <= 1000;
}

function isValidMaxColWidths(maxColWidths: number[]) {
  return maxColWidths.length > 0 && maxColWidths.length <= 100;
}

function isValidMaxRowHeight(maxRowHeight: number) {
  return maxRowHeight > 0 && maxRowHeight <= 20;
}

function isValidTopAndBottomBorder(topAndBottomBorder: boolean) {
  return typeof topAndBottomBorder === "boolean";
}

function isValidHeader(header: boolean) {
  return typeof header === "boolean";
}

function isValidColor(color: string) {
  try {
    chalkPipe(color)("test");
  } catch (err) {
    throw new Error("Invalid color");
  }
  return true;
}

function isValidStyle(style: string) {
  try {
    chalkPipe(style)("test");
  } catch (err) {
    throw new Error("Invalid style");
  }
  return true;
}

function isValidCustomColors(
  customColors: CustomColors[] | undefined,
  table: string[][]
) {
  if (!customColors) return true;
  if (!Array.isArray(customColors)) {
    throw new Error("customColors must be an array of objects");
  }
  for (const color of customColors) {
    const { column, row, fgColor, bgColor, style } = color;
    const numRows = table.length;
    const numColumns = table[0].length;
    isValidColorColumn(column, numColumns);
    isValidColorRow(row, numRows);
    isValid(fgColor, isValidColor, "invalid fgColor for customColors");
    isValid(bgColor, isValidColor, "invalid bgColor for customColors");
    isValid(style, isValidStyle, "invalid style for customColors");
  }
  return true;
}

function isValidColorColumn(
  colorColumn: number | undefined,
  numColumns: number
) {
  if (!colorColumn) return true;
  return colorColumn >= 0 && colorColumn < numColumns;
}

function isValidColorRow(colorRow: number | undefined, numRows: number) {
  if (!colorRow) return true;
  return colorRow >= 0 && colorRow < numRows;
}

function isValidAlternateRows(alternateRows: string[]) {
  if (alternateRows) {
    if (!Array.isArray(alternateRows)) {
      throw new Error("alternateRows must be an array of colors");
    }
    for (const color of alternateRows) {
      if (!isValidColor(color)) {
        throw new Error("alternateRows must contain valid colors");
      }
    }
  }
  return true;
}

function isValidColorsOption(colors: Colors | undefined, table: string[][]) {
  if (!colors) return true;
  const { borderColor, alternateRows, customColors } = colors;

  isValid(borderColor, isValidColor, "Invalid borderColor");
  isValid(alternateRows, isValidAlternateRows, "Invalid alternateRows");
  isValidCustomColors(customColors, table);

  return true;
}

function isValidBorderElement(borderElement: string) {
  return borderElement.length === 1;
}

function isValidBordersOption(borders: Borders | undefined) {
  if (!borders) return true;
  const {
    horizontalLine,
    verticalLine,
    topLeftCorner,
    topRightCorner,
    bottomLeftCorner,
    bottomRightCorner,
    topSeparator,
    bottomSeparator,
  } = borders;

  isValid(
    horizontalLine,
    isValidBorderElement,
    "horizontalLine must be a single character"
  );
  isValid(
    verticalLine,
    isValidBorderElement,
    "verticalLine must be a single character"
  );
  isValid(
    topLeftCorner,
    isValidBorderElement,
    "topLeftCorner must be a single character"
  );
  isValid(
    topRightCorner,
    isValidBorderElement,
    "topRightCorner must be a single character"
  );
  isValid(
    bottomLeftCorner,
    isValidBorderElement,
    "bottomLeftCorner must be a single character"
  );
  isValid(
    bottomRightCorner,
    isValidBorderElement,
    "bottomRightCorner must be a single character"
  );
  isValid(
    topSeparator,
    isValidBorderElement,
    "topSeparator must be a single character"
  );
  isValid(
    bottomSeparator,
    isValidBorderElement,
    "bottomSeparator must be a single character"
  );
}

function isValid(value: any, validationFn: Function, errorMsg: string) {
  if (value && !validationFn(value)) {
    throw new Error(errorMsg);
  }
}

export function checkTableOptionsAreValid(
  table: string[][],
  options: TableOptions
): true | never {
  const {
    cellPadding,
    maxColumns,
    maxRows,
    maxColWidths,
    maxRowHeight,
    topAndBottomBorder,
    header,
    colors,
    borders,
  } = options;

  isValid(
    cellPadding,
    isValidCellPadding,
    "cellPadding must be between 0 and 10"
  );
  isValid(
    maxColumns,
    isValidMaxColumns,
    "maxColumns must be between 1 and 100"
  );
  isValid(maxRows, isValidMaxRows, "maxRows must be between 1 and 1000");
  isValid(
    maxColWidths,
    isValidMaxColWidths,
    "maxColWidths must be between 1 and 100"
  );
  isValid(
    maxRowHeight,
    isValidMaxRowHeight,
    "maxRowHeight must be between 1 and 20"
  );
  isValid(
    topAndBottomBorder,
    isValidTopAndBottomBorder,
    "topAndBottomBorder must be a boolean"
  );
  isValid(header, isValidHeader, "header must be a boolean");

  isValidColorsOption(colors, table);
  isValidBordersOption(borders);

  return true;
}

export function checkTableIsValid(table: string[][]): true | never {
  if (!table || table.length === 0)
    throw new Error("Table must have at least one row");
  if (table[0].length === 0)
    throw new Error("Table must have at least one cell");
  if (!subArraysAreSameLength(table))
    throw new Error("All rows must have same number of columns");
  return true;
}
