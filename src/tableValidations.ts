import chalkPipe = require("chalk-pipe");
import {
  Borders,
  Colors,
  CustomColors,
  TableOptions,
  OptionChecks,
  BorderGlyphs,
  BorderSides,
} from "./tableTypes.js";

type ValidationFn = (value: any) => boolean | never;

const MAX_MAX_COLUMNS = 100;
const MAX_MAX_ROWS = 1000;
const MAX_CELL_PADDING = 20;
const MAX_MAX_COL_WIDTH = 400;
const MAX_ROW_HEIGHT = 50;

const defaultOptionValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  cellPadding: {
    validationFn: isValidCellPadding,
    errorMsg: `cellPadding must be a number between 0 and ${MAX_CELL_PADDING}`,
  },
  maxColumns: {
    validationFn: isValidMaxColumns,
    errorMsg: `maxColumns must be a number between 1 and ${MAX_MAX_COLUMNS}`,
  },
  maxRows: {
    validationFn: isValidMaxRows,
    errorMsg: `maxRows must be a number between 1 and ${MAX_MAX_ROWS}`,
  },
  maxColWidths: {
    validationFn: isValidMaxColWidths,
    errorMsg: `maxColWidths must be a number between 1 and ${MAX_MAX_COL_WIDTH}`,
  },
  maxRowHeight: {
    validationFn: isValidMaxRowHeight,
    errorMsg: `maxRowHeight must be a number between 1 and ${MAX_ROW_HEIGHT}`,
  },
  topAndBottomBorder: {
    validationFn: isValidTopAndBottomBorder,
    errorMsg: "topAndBottomBorder must be a boolean",
  },
  header: { validationFn: isValidHeader, errorMsg: "header must be a boolean" },
};

const colorOptionValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  borderColor: {
    validationFn: isValidColor,
    errorMsg: "Invalid borderColor",
  },
  alternateRows: {
    validationFn: isValidAlternateRows,
    errorMsg: "Invalid alternateRows",
  },
};

const customColorOptionValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  column: {
    validationFn: isValidColorColumn,
    errorMsg: "Invalid color column",
  },
  row: {
    validationFn: isValidColorRow,
    errorMsg: "Invalid color row",
  },
  fgColor: {
    validationFn: isValidColor,
    errorMsg: "Invalid fgColor",
  },
  bgColor: {
    validationFn: isValidColor,
    errorMsg: "Invalid bgColor",
  },
  style: {
    validationFn: isValidStyle,
    errorMsg: "Invalid color style",
  },
};

const borderGlyphValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  horizontalLine: {
    validationFn: isValidBorderGlyph,
    errorMsg: "horizontalLine must be a single character",
  },
  verticalLine: {
    validationFn: isValidBorderGlyph,
    errorMsg: "verticalLine must be a single character",
  },
  topLeftCorner: {
    validationFn: isValidBorderGlyph,
    errorMsg: "topLeftCorner must be a single character",
  },
  topRightCorner: {
    validationFn: isValidBorderGlyph,
    errorMsg: "topRightCorner must be a single character",
  },
  bottomLeftCorner: {
    validationFn: isValidBorderGlyph,
    errorMsg: "bottomLeftCorner must be a single character",
  },
  bottomRightCorner: {
    validationFn: isValidBorderGlyph,
    errorMsg: "bottomRightCorner must be a single character",
  },
  topSeparator: {
    validationFn: isValidBorderGlyph,
    errorMsg: "topSeparator must be a single character",
  },
  bottomSeparator: {
    validationFn: isValidBorderGlyph,
    errorMsg: "bottomSeparator must be a single character",
  },
};

const borderSideValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  top: {
    validationFn: isValidBorderSide,
    errorMsg: "top border side must be a boolean",
  },
  bottom: {
    validationFn: isValidBorderSide,
    errorMsg: "bottom border side must be a boolean",
  },
  left: {
    validationFn: isValidBorderSide,
    errorMsg: "left border side must be a boolean",
  },
  right: {
    validationFn: isValidBorderSide,
    errorMsg: "right border side must be a boolean",
  },
};

function handleInvalidEntry(
  message: string,
  optionChecks: OptionChecks = "error"
) {
  switch (optionChecks) {
    case "error":
      throw new Error(message);
    case "warn":
      console.warn(message);
    case "skip":
      break;
    default:
      throw new Error(
        "optionChecks unset. Must be set to 'error', 'warn', or 'skip'"
      );
  }
}

function isValidCellPadding(cellPadding: number) {
  if (typeof cellPadding !== "number") return false;
  if (cellPadding < 0 || cellPadding > MAX_CELL_PADDING) return false;
  return true;
}

function isValidMaxColumns(maxColumns: number) {
  if (typeof maxColumns !== "number") return false;
  if (maxColumns <= 0 || maxColumns > MAX_MAX_COLUMNS) return false;
  return true;
}

function isValidMaxRows(maxRows: number) {
  if (typeof maxRows !== "number") return false;
  if (maxRows <= 0 || maxRows > MAX_MAX_ROWS) return false;
  return true;
}

function isValidMaxColWidth(maxColWidth: any) {
  if (typeof maxColWidth !== "number") return false;
  if (maxColWidth <= 0 || maxColWidth > MAX_MAX_COL_WIDTH) return false;
  return true;
}

function isValidMaxColWidths(maxColWidths: number[] | number) {
  if (Array.isArray(maxColWidths)) {
    if (maxColWidths.length <= 0 || maxColWidths.length > MAX_MAX_COL_WIDTH)
      return false;
    if (!maxColWidths.every(isValidMaxColWidth)) {
      return false;
    }
  } else {
    if (!isValidMaxColWidth(maxColWidths)) return false;
  }
  return true;
}

function isValidMaxRowHeight(maxRowHeight: number) {
  if (typeof maxRowHeight !== "number") return false;
  if (maxRowHeight <= 0 || maxRowHeight > MAX_ROW_HEIGHT) return false;
  return true;
}

function isValidTopAndBottomBorder(topAndBottomBorder: boolean) {
  return typeof topAndBottomBorder === "boolean";
}

function isValidHeader(header: boolean) {
  return typeof header === "boolean";
}

function isValidBorderGlyph(borderElement: string) {
  return borderElement.length === 1;
}

function isValidBorderSide(borderSide: boolean) {
  return typeof borderSide === "boolean";
}

function isValidBorderGlyphsOption(
  borderGlyphsOption: Partial<BorderGlyphs> | undefined,
  optionChecks: OptionChecks
) {
  if (!borderGlyphsOption) return true;
  if (typeof borderGlyphsOption !== "object") {
    handleInvalidEntry(
      "Invalid border glyphs option. Must be an object.",
      optionChecks
    );
  }
  for (const [option, value] of Object.entries(borderGlyphsOption)) {
    if (option in borderGlyphValidators) {
      const { validationFn, errorMsg } = borderGlyphValidators[option];
      isValid(value, validationFn, errorMsg, optionChecks);
    } else {
      handleInvalidEntry(
        `Invalid border glyph option: ${option}`,
        optionChecks
      );
    }
  }
  return true;
}

function isValidBorderSidesOption(
  borderSidesOption: Partial<BorderSides> | undefined,
  optionChecks: OptionChecks
) {
  if (!borderSidesOption) return true;
  if (typeof borderSidesOption !== "object") {
    handleInvalidEntry(
      "Invalid border sides option. Must be an object.",
      optionChecks
    );
  }
  for (const [option, value] of Object.entries(borderSidesOption)) {
    if (option in borderSideValidators) {
      const { validationFn, errorMsg } = borderSideValidators[option];
      isValid(value, validationFn, errorMsg, optionChecks);
    } else {
      handleInvalidEntry(`Invalid border side option: ${option}`, optionChecks);
    }
  }
  return true;
}

function isValidBordersOption(
  bordersOption: Partial<Borders> | undefined,
  optionChecks: OptionChecks
) {
  if (!bordersOption) return true;
  for (const [option, value] of Object.entries(bordersOption)) {
    if (option === "glyphs") {
      // Handle color validations
      isValidBorderGlyphsOption(
        value as Partial<BorderGlyphs> | undefined,
        optionChecks
      );
    } else if (option === "sides") {
      // Handle color validations
      isValidBorderSidesOption(
        value as Partial<BorderSides> | undefined,
        optionChecks
      );
    } else {
      handleInvalidEntry(`Invalid border option: ${option}`, optionChecks);
    }
  }
  return true;
}

function isValidColor(color: string) {
  if (typeof color !== "string") {
    return false;
  }
  try {
    chalkPipe(color)("test");
  } catch (err) {
    return false;
  }
  return true;
}

function isValidStyle(style: string) {
  try {
    chalkPipe(style)("test");
  } catch (err) {
    return false;
  }
  return true;
}

function isValidCustomColors(
  customColorsOptions: Partial<CustomColors>[] | undefined,
  optionChecks: OptionChecks
) {
  if (!customColorsOptions) return true;
  if (!Array.isArray(customColorsOptions)) {
    handleInvalidEntry(
      "customColors must be an array of objects",
      optionChecks
    );
  }
  customColorsOptions.forEach((customColorsOption) => {
    for (const [option, value] of Object.entries(customColorsOption)) {
      const { validationFn, errorMsg } = customColorOptionValidators[option];
      isValid(value, validationFn, errorMsg, optionChecks);
    }
  });
  return true;
}

function isValidColorColumn(colorColumn: number | undefined) {
  if (!colorColumn) return true;
  if (colorColumn < 0 || colorColumn > MAX_MAX_COLUMNS) return false;
  return true;
}

function isValidColorRow(colorRow: number | undefined) {
  if (!colorRow) return true;
  if (colorRow < 0 || colorRow > MAX_MAX_ROWS) return false;
  return true;
}

function isValidAlternateRows(alternateRows: string[]) {
  if (!alternateRows) return true;
  if (!Array.isArray(alternateRows)) return false;
  if (!alternateRows.every((color) => isValidColor(color))) return false;
  return true;
}

function isValidColorsOption(
  colorsOption: Partial<Colors> | undefined,
  optionChecks: OptionChecks
) {
  if (!colorsOption) return true;
  const { borderColor, alternateRows, customColors } = colorsOption;
  if (!borderColor && !alternateRows && !customColors) {
    handleInvalidEntry(
      "colors must contain at least one of borderColor, alternateRows, or customColors",
      optionChecks
    );
  }

  for (const [option, value] of Object.entries(colorsOption)) {
    if (option === "customColors") {
      isValidCustomColors(
        value as Partial<CustomColors>[] | undefined,
        optionChecks
      );
    } else {
      const { validationFn, errorMsg } = colorOptionValidators[option];
      isValid(value, validationFn, errorMsg!, optionChecks);
    }
  }

  return true;
}

function isValidOptionChecks(optionChecks: any) {
  return (
    optionChecks === "error" ||
    optionChecks === "skip" ||
    optionChecks === "warn"
  );
}

export function isValid(
  value: any,
  validationFn: ValidationFn,
  errorMsg: string,
  optionChecks: OptionChecks = "error"
) {
  if (value !== undefined && !validationFn(value)) {
    handleInvalidEntry(errorMsg, optionChecks);
  }
}

export function checkTableOptionsAreValid(
  options: Partial<TableOptions>
): true | never | void {
  const { optionChecks } = options;
  isValid(optionChecks, isValidOptionChecks, "Invalid value for optionChecks");
  if (optionChecks === "skip") return;

  for (const [option, value] of Object.entries(options)) {
    if (option === "optionChecks") continue;
    if (option === "colors") {
      // Handle color validations
      isValidColorsOption(value as Partial<Colors> | undefined, optionChecks!);
    } else if (option === "borders") {
      // Handle border validations
      isValidBordersOption(
        value as Partial<Borders> | undefined,
        optionChecks!
      );
    } else {
      // Handle all other validations
      const { validationFn, errorMsg } = defaultOptionValidators[option];
      isValid(value, validationFn, errorMsg!, optionChecks);
    }
  }
  return true;
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

export function checkTableIsValid(table: string[][]): true | never {
  if (!table) handleInvalidEntry("A table must be provided", "error");
  if (!Array.isArray(table))
    handleInvalidEntry("Table must be an array", "error");
  if (table.length === 0)
    handleInvalidEntry("Table must have at least one row", "error");
  if (table[0].length === 0)
    handleInvalidEntry("Table must have at least one cell", "error");
  if (!subArraysAreSameLength(table))
    handleInvalidEntry("All rows must have same number of columns", "error");
  return true;
}
