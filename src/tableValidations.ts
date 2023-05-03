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
  if (typeof cellPadding !== "number") return false;
  if (cellPadding <= 0 || cellPadding > 10) return false;
  return true;
}

function isValidMaxColumns(maxColumns: number) {
  if (typeof maxColumns !== "number") return false;
  if (maxColumns <= 0 || maxColumns > 100) return false;
  return true;
}

function isValidMaxRows(maxRows: number) {
  if (typeof maxRows !== "number") return false;
  if (maxRows <= 0 || maxRows > 1000) return false;
  return true;
}

function isValidMaxColWidths(maxColWidths: number[]) {
  if (!Array.isArray(maxColWidths)) return false;
  if (maxColWidths.length <= 0 || maxColWidths.length > 100) return false;
  return true;
}

function isValidMaxRowHeight(maxRowHeight: number) {
  if (typeof maxRowHeight !== "number") return false;
  if (maxRowHeight <= 0 || maxRowHeight > 20) return false;
  return true;
}

function isValidTopAndBottomBorder(topAndBottomBorder: boolean) {
  return typeof topAndBottomBorder === "boolean";
}

function isValidHeader(header: boolean) {
  return typeof header === "boolean";
}

function isValidColor(color: string, strict: boolean = false) {
  // FIXME: This doesn't work for checking for valid colors. They don't error out.
  if (typeof color !== "string") {
    if (strict) throw new Error("Invalid color");
    else console.warn("Invalid color");
  }
  try {
    chalkPipe(color)("test");
  } catch (err) {
    if (strict) throw new Error("Invalid color");
    else console.warn("Invalid color");
  }
  return true;
}

function isValidStyle(style: string, strict: boolean = false) {
  try {
    chalkPipe(style)("test");
  } catch (err) {
    if (strict) throw new Error("Invalid style");
    else console.warn("Invalid style");
  }
  return true;
}

function isValidCustomColors(
  customColors: CustomColors[] | undefined,
  table: string[][],
  strict: boolean = false
) {
  if (!customColors) return true;
  if (!Array.isArray(customColors)) {
    if (strict) throw new Error("customColors must be an array of objects");
    else console.warn("customColors must be an array of objects");
  }
  for (const color of customColors) {
    const { column, row, fgColor, bgColor, style } = color;
    const numRows = table.length;
    const numColumns = table[0].length;
    isValidColorColumn(column, numColumns, strict);
    isValidColorRow(row, numRows, strict);
    isValid(fgColor, isValidColor, "invalid fgColor for customColors", strict);
    isValid(bgColor, isValidColor, "invalid bgColor for customColors", strict);
    isValid(style, isValidStyle, "invalid style for customColors", strict);
  }
  return true;
}

function isValidColorColumn(
  colorColumn: number | undefined,
  numColumns: number,
  strict: boolean = false
) {
  if (!colorColumn) return true;
  if (colorColumn < 0 || colorColumn > numColumns - 1) {
    if (strict) throw new Error("Invalid colorColumn");
    else console.warn("Invalid colorColumn");
  }
}

function isValidColorRow(
  colorRow: number | undefined,
  numRows: number,
  strict: boolean = false
) {
  if (!colorRow) return true;
  if (colorRow < 0 || colorRow > numRows - 1) {
    if (strict) throw new Error("Invalid colorRow");
    else console.warn("Invalid colorRow");
  }
}

function isValidAlternateRows(
  alternateRows: string[],
  strict: boolean = false
) {
  if (alternateRows) {
    if (!Array.isArray(alternateRows)) {
      if (strict) throw new Error("alternateRows must be an array of colors");
      else console.warn("alternateRows must be an array of colors");
    }
    for (const color of alternateRows) {
      if (!isValidColor(color)) {
        if (strict) throw new Error("alternateRows must contain valid colors");
        else console.warn("alternateRows must contain valid colors");
      }
    }
  }
  return true;
}

function isValidColorsOption(
  colors: Colors | undefined,
  table: string[][],
  strict: boolean = false
) {
  if (!colors) return true;
  const { borderColor, alternateRows, customColors } = colors;
  if (!borderColor && !alternateRows && !customColors) {
    if (strict) {
      throw new Error(
        "colors must contain at least one of borderColor, alternateRows, or customColors"
      );
    } else {
      console.warn(
        "colors must contain at least one of borderColor, alternateRows, or customColors"
      );
    }
  }

  isValid(borderColor, isValidColor, "Invalid borderColor", strict);
  isValid(alternateRows, isValidAlternateRows, "Invalid alternateRows", strict);
  isValidCustomColors(customColors, table, strict);

  return true;
}

function isValidBorderElement(borderElement: string) {
  return borderElement.length === 1;
}

function isValidBordersOption(
  borders: Borders | undefined,
  strict: boolean = false
) {
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
    "horizontalLine must be a single character",
    strict
  );
  isValid(
    verticalLine,
    isValidBorderElement,
    "verticalLine must be a single character",
    strict
  );
  isValid(
    topLeftCorner,
    isValidBorderElement,
    "topLeftCorner must be a single character",
    strict
  );
  isValid(
    topRightCorner,
    isValidBorderElement,
    "topRightCorner must be a single character",
    strict
  );
  isValid(
    bottomLeftCorner,
    isValidBorderElement,
    "bottomLeftCorner must be a single character",
    strict
  );
  isValid(
    bottomRightCorner,
    isValidBorderElement,
    "bottomRightCorner must be a single character",
    strict
  );
  isValid(
    topSeparator,
    isValidBorderElement,
    "topSeparator must be a single character",
    strict
  );
  isValid(
    bottomSeparator,
    isValidBorderElement,
    "bottomSeparator must be a single character",
    strict
  );
}

function isValid(
  value: any,
  validationFn: Function,
  errorMsg: string,
  strict: boolean = false
) {
  if (value !== undefined && !validationFn(value, strict)) {
    if (strict) {
      throw new Error(errorMsg);
    } else console.warn(errorMsg);
  }
}

export function checkTableOptionsAreValid(
  table: string[][],
  options: TableOptions
): true | never {
  const {
    strict,
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
    "cellPadding must be a number between 0 and 10",
    strict
  );
  isValid(
    maxColumns,
    isValidMaxColumns,
    "maxColumns must be a number between 1 and 100",
    strict
  );
  isValid(
    maxRows,
    isValidMaxRows,
    "maxRows must be a number between 1 and 1000",
    strict
  );
  isValid(
    maxColWidths,
    isValidMaxColWidths,
    "maxColWidths must be a number between 1 and 100",
    strict
  );
  isValid(
    maxRowHeight,
    isValidMaxRowHeight,
    "maxRowHeight must be a number between 1 and 20",
    strict
  );
  isValid(
    topAndBottomBorder,
    isValidTopAndBottomBorder,
    "topAndBottomBorder must be a boolean",
    strict
  );
  isValid(header, isValidHeader, "header must be a boolean", strict);

  isValidColorsOption(colors, table, strict);
  isValidBordersOption(borders, strict);

  return true;
}

export function checkTableIsValid(table: string[][]): true | never {
  if (!table) throw new Error("A table must be provided");
  if (!Array.isArray(table)) throw new Error("Table must be an array");
  if (table.length === 0) throw new Error("Table must have at least one row");
  if (table[0].length === 0)
    throw new Error("Table must have at least one cell");
  if (!subArraysAreSameLength(table))
    throw new Error("All rows must have same number of columns");
  return true;
}
