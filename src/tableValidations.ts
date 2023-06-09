import chalk = require("chalk/index.js");
import {
  Borders,
  Colors,
  OptionChecks,
  BorderGlyphs,
  BorderSides,
  PartialTableOptions,
  TargetCellsColors,
  CellStyle,
  PartialCellStyle,
} from "./tableTypes.js";

type ValidationFn = (value: any) => boolean | never;

let optionChecks: OptionChecks;

const MAX_MAX_COLUMNS = 100;
const MIN_MAX_COLUMNS = 1;
const MAX_MAX_ROWS = 1000;
const MIN_MAX_ROWS = 1;
const MAX_CELL_PADDING = 20;
const MIN_CELL_PADDING = 0;
const MAX_MAX_COL_WIDTH = 400;
const MIN_MAX_COL_WIDTH = 1;
const MAX_MAX_ROW_HEIGHT = 50;
const MIN_MAX_ROW_HEIGHT = 1;

const defaultOptionValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  cellPadding: {
    validationFn: (padding: number) =>
      isNumInRange(padding, MIN_CELL_PADDING, MAX_CELL_PADDING),
    errorMsg: `cellPadding must be a number between ${MIN_CELL_PADDING} and ${MAX_CELL_PADDING}`,
  },
  maxColumns: {
    validationFn: (maxCol: number) =>
      isNumInRange(maxCol, MIN_MAX_COLUMNS, MAX_MAX_COLUMNS),
    errorMsg: `maxColumns must be a number between ${MIN_MAX_COLUMNS} and ${MAX_MAX_COLUMNS}`,
  },
  maxRows: {
    validationFn: (maxRow: number) =>
      isNumInRange(maxRow, MIN_MAX_ROWS, MAX_MAX_ROWS),
    errorMsg: `maxRows must be a number between ${MIN_MAX_ROWS} and ${MAX_MAX_ROWS}`,
  },
  maxColWidths: {
    validationFn: isValidMaxColWidths,
    errorMsg: `maxColWidths must be a number or array of numbers between ${MIN_MAX_COL_WIDTH} and ${MAX_MAX_COL_WIDTH}`,
  },
  maxRowHeight: {
    validationFn: (maxRowHeight: number) =>
      isNumInRange(maxRowHeight, MIN_MAX_ROW_HEIGHT, MAX_MAX_ROW_HEIGHT),
    errorMsg: `maxRowHeight must be a number between ${MIN_MAX_ROW_HEIGHT} and ${MAX_MAX_ROW_HEIGHT}`,
  },
  header: {
    validationFn: isBoolean,
    errorMsg: "header must be a boolean",
  },
};

const colorOptionValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  borderColor: {
    validationFn: (style: CellStyle) => isValidCellStyleOption(style),
    errorMsg: "Invalid borderColor",
  },
  alternateRows: {
    validationFn: (rows: CellStyle[]) => isValidAlternateRowsOption(rows),
    errorMsg: "Invalid alternateRows",
  },
};

const targetCellsColorsValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  column: {
    validationFn: (column: number) => isNumInRange(column, 0, MAX_MAX_COLUMNS),
    errorMsg: "Invalid color column",
  },
  row: {
    validationFn: (row: number) => isNumInRange(row, 0, MAX_MAX_ROWS),
    errorMsg: "Invalid color row",
  },
  fgColor: {
    validationFn: (color: string) => isValidChalkValue(color, "color"),
    errorMsg: "Invalid fgColor",
  },
  bgColor: {
    validationFn: (color: string) => isValidChalkValue(color, "color"),
    errorMsg: "Invalid bgColor",
  },
  style: {
    validationFn: (style: string) => isValidChalkValue(style, "style"),
    errorMsg: "Invalid color style",
  },
};

function handleInvalidEntry(message: string) {
  switch (optionChecks || "error") {
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

function isBoolean(value: any) {
  return typeof value === "boolean";
}

function isValidArray(array: any, validationFn: ValidationFn) {
  if (!Array.isArray(array)) {
    handleInvalidEntry(`Invalid array: ${array}. Must be an array.`);
    return false;
  }
  if (!array.every(validationFn)) {
    handleInvalidEntry(`Invalid array: ${array}.`);
    return false;
  }
  return true;
}

function isNumInRange(num: number, min: number, max: number) {
  if (typeof num !== "number" || !(num >= min && num <= max)) return false;
  return true;
}

function isValidBorderGlyph(glyph: string) {
  if (glyph === undefined) return true;
  if (typeof glyph !== "string" || glyph.length !== 1) {
    handleInvalidEntry(
      `Invalid border glyph: ${glyph}. Must be a single character string.`
    );
    return false;
  }
  return true;
}

function isValidCellStyleOption(cellStyle: CellStyle) {
  if (cellStyle === undefined) return true;
  if (typeof cellStyle !== "object") {
    handleInvalidEntry("Invalid cell style option. Must be an object.");
    return false;
  }
  for (const [key, value] of Object.entries(cellStyle)) {
    const type = key === "fgColor" || key === "bgColor" ? "color" : "style";
    if (!isValidChalkValue(value, type)) return false;
  }
  return true;
}

function isValidChalkValue(value: string, type: "color" | "style") {
  if (value === undefined) return true;
  if (typeof value !== "string") {
    handleInvalidEntry(`Invalid ${type}: ${value}. Must be a string.`);
    return false;
  }
  try {
    // chalk.keyword(value)("test");
  } catch (err) {
    handleInvalidEntry(
      `Invalid ${type}: ${value}. Must be a valid chalk ${type}.`
    );
    return false;
  }
  return true;
}

function isValidBorderGlyphsOption(glyphs: BorderGlyphs) {
  if (glyphs === undefined) return true;
  if (typeof glyphs !== "object") {
    handleInvalidEntry("Invalid border glyphs option. Must be an object.");
    return false;
  }
  for (const [_, glyph] of Object.entries(glyphs)) {
    if (!isValidBorderGlyph(glyph)) {
      return false;
    }
  }
  return true;
}

function isValidMaxColWidths(maxColWidths: number[] | number) {
  if (maxColWidths === undefined) return true;
  if (Array.isArray(maxColWidths)) {
    if (maxColWidths.length <= 0) return false;
    if (
      !maxColWidths.every((width) => isNumInRange(width, 1, MAX_MAX_COL_WIDTH))
    ) {
      return false;
    }
  } else {
    if (!isNumInRange(maxColWidths, 1, MAX_MAX_COL_WIDTH)) return false;
  }
  return true;
}

const validBorderSides = [
  "top",
  "right",
  "bottom",
  "left",
  "betweenColumns",
  "betweenRows",
];

function isValidBorderSidesOption(borderSidesOption: BorderSides) {
  if (borderSidesOption === undefined) return true;
  if (typeof borderSidesOption !== "object") {
    handleInvalidEntry("Invalid border sides option. Must be an object.");
    return false;
  }
  for (const [name, value] of Object.entries(borderSidesOption)) {
    if (typeof value !== "boolean") {
      handleInvalidEntry("Invalid border side option. Must be a boolean.");
      return false;
    } else {
      if (!validBorderSides.includes(name)) {
        handleInvalidEntry(
          `Invalid border side option. Must be one of ${validBorderSides.join(
            ", "
          )}`
        );
        return false;
      }
    }
  }
  return true;
}

function isValidBordersOption(bordersOption: Borders) {
  if (bordersOption === undefined) return true;
  if (typeof bordersOption === "boolean") return true;
  if (typeof bordersOption !== "object") {
    handleInvalidEntry("Invalid border option. Must be an object.");
    return false;
  }
  if (!("sides" in bordersOption || "glyphs" in bordersOption)) {
    handleInvalidEntry("Invalid border option. Must include sides or glyphs.");
    return false;
  }
  for (const [option, value] of Object.entries(bordersOption)) {
    if (option === "glyphs") {
      if (!isValidBorderGlyphsOption(value as BorderGlyphs)) {
        handleInvalidEntry(
          "Invalid border glyphs option. Must be an object with a single character string for each glyph."
        );
        return false;
      }
    } else if (option === "sides") {
      isValidBorderSidesOption(value as BorderSides);
    } else {
      handleInvalidEntry(
        "Invalid border option. Must include sides or glyphs."
      );
      return false;
    }
  }
  return true;
}

function isValidTargetCells(targetCellsColorsOptions: TargetCellsColors[]) {
  if (targetCellsColorsOptions === undefined) return true;
  if (!Array.isArray(targetCellsColorsOptions)) {
    handleInvalidEntry("targetCells must be an array of objects");
    return false;
  }
  if (targetCellsColorsOptions.length === 0) return false;
  targetCellsColorsOptions.forEach((targetCellsColorsOption) => {
    if (typeof targetCellsColorsOption !== "object") {
      handleInvalidEntry("targetCells must be an array of objects");
      return false;
    }
    const { column, row } = targetCellsColorsOption;
    if (column === undefined && row === undefined) {
      handleInvalidEntry(
        "targetCells must contain at least one of column or row"
      );
      return false;
    }
    for (const [option, value] of Object.entries(targetCellsColorsOption)) {
      const { validationFn, errorMsg } = targetCellsColorsValidators[option];
      isValid(value, validationFn, errorMsg);
    }
  });
  return true;
}

function isValidStyleOption(styleOption: PartialCellStyle) {
  if (styleOption === undefined) return true;
  if (typeof styleOption !== "object") {
    handleInvalidEntry("Invalid style option. Must be an object.");
    return false;
  }
  if (!isValidCellStyleOption(styleOption)) return false;
  return true;
}

function isValidAlternateRowsOption(alternateRowsOption: CellStyle[]) {
  if (alternateRowsOption === undefined) return true;
  if (!Array.isArray(alternateRowsOption)) return false;
  if (alternateRowsOption.length === 0) return false;
  if (!isValidArray(alternateRowsOption, isValidStyleOption)) {
    return false;
  }
  return true;
}

function isValidColorsOption(colorsOption: Colors) {
  if (colorsOption === undefined) return true;
  if (typeof colorsOption === "boolean") return true;
  if (typeof colorsOption !== "object") {
    handleInvalidEntry("colors must be an object or a boolean");
    return false;
  }
  if (
    !("borderColor" in colorsOption) &&
    !("alternateRows" in colorsOption) &&
    !("targetCells" in colorsOption)
  ) {
    handleInvalidEntry(
      "colors must contain at least one of borderColor, alternateRows, or targetCells"
    );
    return false;
  }
  for (const [option, value] of Object.entries(colorsOption)) {
    if (option === "targetCells") {
      if (!isValidTargetCells(value as TargetCellsColors[])) {
        handleInvalidEntry(
          "targetCells must be an array of objects with column and/or row properties"
        );
        return false;
      }
    } else {
      const { validationFn, errorMsg } = colorOptionValidators[option];
      isValid(value, validationFn, errorMsg!);
    }
  }

  return true;
}

export function isValid(
  value: any,
  validationFn: ValidationFn,
  errorMsg: string
) {
  if (value !== undefined && !validationFn(value)) {
    handleInvalidEntry(errorMsg);
    return false;
  }
  return true;
}

function isValidOptionChecks(optionChecks: OptionChecks | undefined) {
  if (optionChecks === undefined) return false;
  const validOptionChecks = ["error", "warn", "skip"];
  if (!validOptionChecks.includes(optionChecks)) {
    handleInvalidEntry(
      "optionChecks must be set to 'error', 'warn', or 'skip'"
    );
    return false;
  }
  return true;
}

function getValidOptionChecksVal(optionChecksOption?: OptionChecks) {
  if (isValidOptionChecks(optionChecksOption)) {
    return optionChecksOption as OptionChecks;
  } else {
    return "error";
  }
}

export function checkTableOptionsAreValid(
  options: PartialTableOptions | undefined
): void | true {
  if (!options) return;
  optionChecks = getValidOptionChecksVal(options?.optionChecks);
  if (optionChecks === "skip") return;

  for (const [option, value] of Object.entries(options)) {
    if (option === "optionChecks") continue;
    if (option === "colors") {
      // Handle color validations
      isValidColorsOption(value as Colors);
    } else if (option === "borders") {
      // Handle border validations
      isValidBordersOption(value as Borders);
    } else {
      // Handle all other validations
      const { validationFn, errorMsg } = defaultOptionValidators[option];
      isValid(value, validationFn, errorMsg!);
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

export function checkTableIsValid(table: string[][]): void {
  optionChecks = getValidOptionChecksVal();
  if (!table) handleInvalidEntry("A table must be provided");
  if (!Array.isArray(table)) handleInvalidEntry("Table must be an array");
  if (table.length === 0)
    handleInvalidEntry("Table must have at least one row");
  if (table[0].length === 0)
    handleInvalidEntry("Table must have at least one cell");
  if (!subArraysAreSameLength(table))
    handleInvalidEntry("All rows must have same number of columns");
}
