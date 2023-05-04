import chalkPipe = require("chalk-pipe");
import {
  Borders,
  Colors,
  CustomColors,
  TableOptions,
  ValidationMode,
} from "./tableTypes.js";

function handleInvalidEntry(
  message: string,
  validationMode: ValidationMode = "error"
) {
  switch (validationMode) {
    case "error":
      throw new Error(message);
    case "warn":
      console.warn(message);
    case "skipChecks":
      break;
    default:
      throw new Error(
        "validationMode unset. Must be set to 'error', 'warn', or 'skipChecks'"
      );
  }
}

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
  if (cellPadding < 0 || cellPadding > 10) return false;
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

function isValidMaxColWidths(maxColWidths: number[] | number) {
  if (Array.isArray(maxColWidths)) {
    if (maxColWidths.length <= 0 || maxColWidths.length > 100) return false;
  } else if (typeof maxColWidths === "number") {
    if (maxColWidths <= 0 || maxColWidths > 100) return false;
  } else {
    return false;
  }
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

function isValidColor(color: string, validationMode: ValidationMode = "error") {
  // FIXME: This doesn't work for checking for valid colors. They don't error out.
  if (typeof color !== "string") {
    handleInvalidEntry("Invalid color", validationMode);
  }
  try {
    chalkPipe(color)("test");
  } catch (err) {
    handleInvalidEntry("Invalid color", validationMode);
  }
  return true;
}

function isValidStyle(style: string, validationMode: ValidationMode = "error") {
  try {
    chalkPipe(style)("test");
  } catch (err) {
    handleInvalidEntry("Invalid style", validationMode);
  }
  return true;
}

function isValidCustomColors(
  customColors: CustomColors[] | undefined,
  table: string[][],
  validationMode: ValidationMode = "error"
) {
  if (!customColors) return true;
  if (!Array.isArray(customColors)) {
    handleInvalidEntry(
      "customColors must be an array of objects",
      validationMode
    );
  }
  for (const color of customColors) {
    const { column, row, fgColor, bgColor, style } = color;
    const numRows = table.length;
    const numColumns = table[0].length;
    isValidColorColumn(column, numColumns, validationMode);
    isValidColorRow(row, numRows, validationMode);
    isValid(
      fgColor,
      isValidColor,
      "invalid fgColor for customColors",
      validationMode
    );
    isValid(
      bgColor,
      isValidColor,
      "invalid bgColor for customColors",
      validationMode
    );
    isValid(
      style,
      isValidStyle,
      "invalid style for customColors",
      validationMode
    );
  }
  return true;
}

function isValidColorColumn(
  colorColumn: number | undefined,
  numColumns: number,
  validationMode: ValidationMode = "error"
) {
  if (!colorColumn) return true;
  if (colorColumn < 0 || colorColumn > numColumns - 1) {
    handleInvalidEntry("Invalid colorColumn", validationMode);
  }
}

function isValidColorRow(
  colorRow: number | undefined,
  numRows: number,
  validationMode: ValidationMode = "error"
) {
  if (!colorRow) return true;
  if (colorRow < 0 || colorRow > numRows - 1) {
    handleInvalidEntry("Invalid colorRow", validationMode);
  }
}

function isValidAlternateRows(
  alternateRows: string[],
  validationMode: ValidationMode = "error"
) {
  if (alternateRows) {
    if (!Array.isArray(alternateRows)) {
      handleInvalidEntry(
        "alternateRows must be an array of colors",
        validationMode
      );
    }
    for (const color of alternateRows) {
      if (!isValidColor(color)) {
        handleInvalidEntry(
          "alternateRows must contain valid colors",
          validationMode
        );
      }
    }
  }
  return true;
}

function isValidColorsOption(
  colors: Colors | undefined,
  table: string[][],
  validationMode: ValidationMode = "error"
) {
  if (!colors) return true;
  const { borderColor, alternateRows, customColors } = colors;
  if (!borderColor && !alternateRows && !customColors) {
    handleInvalidEntry(
      "colors must contain at least one of borderColor, alternateRows, or customColors",
      validationMode
    );
  }

  isValid(borderColor, isValidColor, "Invalid borderColor", validationMode);
  isValid(
    alternateRows,
    isValidAlternateRows,
    "Invalid alternateRows",
    validationMode
  );
  isValidCustomColors(customColors, table, validationMode);

  return true;
}

function isValidBorderElement(borderElement: string) {
  return borderElement.length === 1;
}

function isValidBordersOption(
  borders: Borders | undefined,
  validationMode: ValidationMode = "error"
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
    validationMode
  );
  isValid(
    verticalLine,
    isValidBorderElement,
    "verticalLine must be a single character",
    validationMode
  );
  isValid(
    topLeftCorner,
    isValidBorderElement,
    "topLeftCorner must be a single character",
    validationMode
  );
  isValid(
    topRightCorner,
    isValidBorderElement,
    "topRightCorner must be a single character",
    validationMode
  );
  isValid(
    bottomLeftCorner,
    isValidBorderElement,
    "bottomLeftCorner must be a single character",
    validationMode
  );
  isValid(
    bottomRightCorner,
    isValidBorderElement,
    "bottomRightCorner must be a single character",
    validationMode
  );
  isValid(
    topSeparator,
    isValidBorderElement,
    "topSeparator must be a single character",
    validationMode
  );
  isValid(
    bottomSeparator,
    isValidBorderElement,
    "bottomSeparator must be a single character",
    validationMode
  );
}

function isValid(
  value: any,
  validationFn: Function,
  errorMsg: string,
  validationMode: ValidationMode = "error"
) {
  if (value !== undefined && !validationFn(value, validationMode)) {
    handleInvalidEntry(errorMsg, validationMode);
  }
}

export function checkTableOptionsAreValid(
  table: string[][],
  options: Partial<TableOptions>
): true | never {
  const {
    validationMode,
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

  if (validationMode === "skipChecks") return true;

  isValid(
    cellPadding,
    isValidCellPadding,
    "cellPadding must be a number between 0 and 10",
    validationMode
  );
  isValid(
    maxColumns,
    isValidMaxColumns,
    "maxColumns must be a number between 1 and 100",
    validationMode
  );
  isValid(
    maxRows,
    isValidMaxRows,
    "maxRows must be a number between 1 and 1000",
    validationMode
  );
  isValid(
    maxColWidths,
    isValidMaxColWidths,
    "maxColWidths must be a number between 1 and 100",
    validationMode
  );
  isValid(
    maxRowHeight,
    isValidMaxRowHeight,
    "maxRowHeight must be a number between 1 and 20",
    validationMode
  );
  isValid(
    topAndBottomBorder,
    isValidTopAndBottomBorder,
    "topAndBottomBorder must be a boolean",
    validationMode
  );
  isValid(header, isValidHeader, "header must be a boolean", validationMode);

  isValidColorsOption(colors, table, validationMode);
  isValidBordersOption(borders, validationMode);

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
