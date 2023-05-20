import {
  Borders,
  OptionChecks,
  BorderGlyphs,
  BorderSides,
  PartialTableOptions,
  StyleObj,
  TargetCellStyle,
  borderSides,
  Styles,
} from "./tableTypes";

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

const stylesOptionValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  borderStyle: {
    validationFn: (style: StyleObj) => isValidStyleObj(style),
    errorMsg: "Invalid borderStyle",
  },
  rowStyles: {
    validationFn: (rows: StyleObj[]) => isValidRowStylesOption(rows),
    errorMsg: "Invalid rowStyles",
  },
};

const targetCellStylesValidators: Record<
  string,
  { validationFn: ValidationFn; errorMsg: string }
> = {
  column: {
    validationFn: (column: number) => isNumInRange(column, 0, MAX_MAX_COLUMNS),
    errorMsg: "Invalid targetCellStyle column",
  },
  row: {
    validationFn: (row: number) => isNumInRange(row, 0, MAX_MAX_ROWS),
    errorMsg: "Invalid targetCellStyle row",
  },
  fgColor: {
    validationFn: (color: string) => isValidChalkValue(color, "color"),
    errorMsg: "Invalid fgColor",
  },
  bgColor: {
    validationFn: (color: string) => isValidChalkValue(color, "color"),
    errorMsg: "Invalid bgColor",
  },
  modifier: {
    validationFn: (modifier: string) => isValidChalkValue(modifier, "modifier"),
    errorMsg: "Invalid modifier",
  },
};

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

function isEmptyObj(obj: object): boolean {
  return Object.keys(obj).length === 0;
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
      if (!borderSides.includes(name)) {
        handleInvalidEntry(
          `Invalid border side option. Must be one of ${borderSides.join(", ")}`
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

function isValidStyleObj(styleObj: StyleObj) {
  if (styleObj === undefined) return true;
  if (typeof styleObj !== "object") {
    handleInvalidEntry("Invalid style. Must be an object.");
    return false;
  }
  if (isEmptyObj(styleObj)) {
    handleInvalidEntry("Invalid style. Must not be empty.");
    return false;
  }
  for (const [key, value] of Object.entries(styleObj)) {
    const type = key === "fgColor" || key === "bgColor" ? "color" : "modifier";
    if (!isValidChalkValue(value, type)) return false;
  }
  return true;
}

function isValidChalkValue(value: string, type: "color" | "modifier") {
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

function isValidTargetCellStyles(targetCellStylesOptions: TargetCellStyle[]) {
  if (targetCellStylesOptions === undefined) return true;
  if (!Array.isArray(targetCellStylesOptions)) {
    handleInvalidEntry("targetCellStyles option must be an array of objects");
    return false;
  }
  if (targetCellStylesOptions.length === 0) return false;
  targetCellStylesOptions.forEach((styleObj) => {
    if (typeof styleObj !== "object") {
      handleInvalidEntry("targetCellStyles option must be an array of objects");
      return false;
    }
    const { column, row } = styleObj;
    if (column === undefined && row === undefined) {
      handleInvalidEntry("each targetCellStyle must contain a column or row");
      return false;
    }
    for (const [option, value] of Object.entries(styleObj)) {
      const { validationFn, errorMsg } = targetCellStylesValidators[option];
      isValid(value, validationFn, errorMsg);
    }
  });
  return true;
}

function isValidRowStylesOption(rowStylesOption: StyleObj[]) {
  if (rowStylesOption === undefined) return true;
  if (!Array.isArray(rowStylesOption)) return false;
  if (rowStylesOption.length === 0) return false;
  if (!isValidArray(rowStylesOption, isValidStyleObj)) {
    return false;
  }
  return true;
}

function isValidStylesOption(stylesOption: Styles) {
  console.log("stylesOption: ", stylesOption);
  if (stylesOption === undefined) return true;
  if (typeof stylesOption === "boolean") return true;
  if (typeof stylesOption !== "object") {
    handleInvalidEntry("styles option must be an object or a boolean");
    return false;
  }
  if (
    !("borderStyle" in stylesOption) &&
    !("rowStyles" in stylesOption) &&
    !("targetCellStyles" in stylesOption)
  ) {
    handleInvalidEntry(
      "styles option must contain at least one of borderStyle, rowStyles, or targetCellStyles"
    );
    return false;
  }
  for (const [option, value] of Object.entries(stylesOption)) {
    if (option === "targetCellStyles") {
      if (!isValidTargetCellStyles(value as TargetCellStyle[])) {
        handleInvalidEntry(
          "targetCellStyles must be an array of objects with column and/or row properties"
        );
        return false;
      }
    } else {
      if (option === "borderStyle") debugger;
      const { validationFn, errorMsg } = stylesOptionValidators[option];
      isValid(value, validationFn, errorMsg!);
    }
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
    if (option === "styles") {
      // Handle color validations
      isValidStylesOption(value as Styles);
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
