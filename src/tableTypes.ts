import { Cell } from "./Cell";
import { Row } from "./Row";

export interface VersitableType {
  _rows: Row[];
  _options: TableOptions;
  _colWidths: number[];

  constructor: Function;

  // Mutations to formattedTable
  limitInputRows(inputTable: string[][]): string[][];
  limitInputCols(inputTable: string[][]): string[][];
  splitCellsBetweenRows(): void;
  padCells(): void;
  addBorders(): void;

  // Calculations for table properties
  calcColWidths(): number[];

  // Helper methods
  createStyledCell(cellString: string, cellStyle: CellStyle): string;
  findHorizontalBorderInsertIdxs(type: HorizontalBorder): number[];
  insertHorizontalBorder(type: HorizontalBorder): void;
  insertVerticalBorder(type: VerticalBorder): void;
  populateArrFromMaxColWidths(): number[];
  populateBordersOptWithDefaults(): void;
  populateColorsOptWithDefaults(): void;
  getGlyphsForBorderType(type: HorizontalBorder): HorizontalGlyphs;
  getGlyphsForBorderType(type: VerticalBorder): VerticalGlyphs;

  // Validation methods
  validateTable(table: string[][]): void;
  validateOptions(options: PartialTableOptions): void;
}

export interface ICell {
  type: CellType;
  content: string;
  length: number;
  color?: string;

  splitAt(index: number): Cell[];
  pad(padLength: number, align?: Align): void;
  isBorder(): boolean;
}

export type RowType =
  | "primary"
  | "overflow"
  | "upperBorder"
  | "lowerBorder"
  | "innerBorder";

export interface IRow {
  cells: ICell[];
  length: number;
  type: RowType;
  borders: Set<AnyBorder>;
  constructor: Function;
}

export type Align = "left" | "right" | "center";

export type CellType = RegularCellContent | AnyBorder;

export type RegularCellContent = "primary" | "overflow";

export type AnyBorder = HorizontalBorder | VerticalBorder;

export type HorizontalBorder = "top" | "bottom" | "betweenRows";

export type VerticalBorder = "left" | "right" | "betweenColumns";

export const cellTypesArr: CellType[] = [
  "primary",
  "overflow",
  "top",
  "bottom",
  "left",
  "right",
  "betweenColumns",
  "betweenRows",
];

export interface TableOptions {
  optionChecks: OptionChecks; // Should createTable throw errors, warnings or skip checks altogether
  cellPadding: number; // Padding between cell content and cell border (minimum if cells vary in length) (end of cell only)
  maxColumns: number; // Max number of columns
  maxRows: number; // Max number of rows (not including "overflow rows": rows with height > 1)
  maxColWidths: number[] | number; // Max column widths (doesn't include padding)
  maxRowHeight: number; // Lines of text per cell (only applies if cell content will be truncated)
  header: boolean; // Whether to include a header row (this defaults to the first row of the table)
  colors: Colors; // Colors for borders, alternate rows and targetCells colors
  borders: Borders; // AnyBorder sides and glyphs
}

export interface PartialTableOptions extends DeepPartial<TableOptions> {}

export type OptionChecks = "error" | "warn" | "skip";

export type Colors = Partial<CustomColors> | boolean;

export type Borders = DeepPartial<CustomBorders> | boolean;

export type CustomColorsTarget =
  | "alternateRows"
  | "borderColor"
  | "targetCells";

export interface CustomColors {
  borderColor: PartialCellStyle;
  alternateRows: PartialCellStyle[];
  targetCells: TargetCellsColors[];
}

export interface CellStyle {
  style?: string;
  fgColor?: string;
  bgColor?: string;
}

// must have either fgColor or bgColor specified, but not necessarily both
export type PartialCellStyle = CellStyle &
  (
    | { fgColor: string; bgColor?: string }
    | { fgColor?: string; bgColor: string }
  );

// must have either row or column specified, but not necessarily both
export type TargetCellsColors = PartialCellStyle &
  ({ column: number; row?: number } | { column?: number; row: number });

export interface BorderSides {
  top: boolean;
  bottom: boolean;
  left: boolean;
  right: boolean;
  betweenColumns: boolean;
  betweenRows: boolean;
}

export interface CustomBorders {
  sides: BorderSides;
  glyphs: BorderGlyphs;
}

export type HorizontalGlyphs = {
  horizontalLine: string;
};

export type VerticalGlyphs = {
  verticalLine: string;
  topEdge: string;
  bottomEdge: string;
  separator: string;
};

export interface BorderGlyphs {
  horizontalLine: string;
  verticalLine: string;
  topLeftCorner: string;
  topRightCorner: string;
  bottomLeftCorner: string;
  bottomRightCorner: string;
  topSeparator: string;
  leftSeparator: string;
  rightSeparator: string;
  bottomSeparator: string;
  middleSeparator: string;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export const chalkFgColors = [
  "black",
  "red",
  "green",
  "yellow",
  "blue",
  "magenta",
  "cyan",
  "white",
  "gray",
  "grey",
  "blackBright",
  "redBright",
  "greenBright",
  "yellowBright",
  "blueBright",
  "magentaBright",
  "cyanBright",
  "whiteBright",
];

export const chalkBgColors = [
  "bgBlack",
  "bgRed",
  "bgGreen",
  "bgYellow",
  "bgBlue",
  "bgMagenta",
  "bgCyan",
  "bgWhite",
  "bgGray",
  "bgGrey",
  "bgBlackBright",
  "bgRedBright",
  "bgGreenBright",
  "bgYellowBright",
  "bgBlueBright",
  "bgMagentaBright",
  "bgCyanBright",
  "bgWhiteBright",
];

export const chalkModifiers = [
  "reset",
  "bold",
  "dim",
  "italic",
  "underline",
  "inverse",
  "hidden",
  "strikethrough",
  "visible",
];
