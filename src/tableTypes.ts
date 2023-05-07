export interface VersitableType {
  formattedTable: string[][];
  options: TableOptions;
  cellLengths: number[][];
  colWidths: number[];
  rowHeights: number[];
  borderRowIdxs: number[];
  borderColumnsIdxs: number[];

  constructor(cells: string[][], options: TableOptions): void;

  // User-facing functions
  log(): void;

  // Mutations to formattedTable
  limitRows(): void;
  limitCols(): void;
  splitCells(): void;
  padCells(): void;
  addBorders(): void;

  // Calculations for table properties
  calcCellLengths(): void;
  calcColWidths(): void;

  // Helper functions
  calcAdjustedMaxColWidths(): number[];
  arrFromMaxColWidths(): number[];
  longestStrLenInCol(): number[];
  padCell(cell: string, cellPadding: number): string;
  newInsertRow(): string[];
  createHorizontalBorder(type: "top" | "bottom" | "between"): string[];
  createVerticalBorder(border: "left" | "right" | "between"): string[];
}

export type Table = string[][];

export type OptionChecks = "error" | "warn" | "skip";

export interface CustomColors {
  column: number;
  row: number;
  style: string;
  fgColor: string;
  bgColor: string;
}

export interface Colors {
  borderColor: string;
  alternateRows: string[];
  customColors?: CustomColors[];
}

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

export type Borders = DeepPartial<CustomBorders> | boolean;

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

export interface TableOptions {
  optionChecks: OptionChecks; // Should createTable throw errors, warnings or skip checks altogether
  cellPadding: number; // Padding between cell content and cell border (minimum if cells vary in length) (end of cell only)
  maxColumns: number; // Max number of columns
  maxRows: number; // Max number of rows (not including "overflow rows": rows with height > 1)
  maxColWidths: number[] | number; // Max column widths (doesn't include padding)
  maxRowHeight: number; // Lines of text per cell (only applies if cell content will be truncated)
  header: boolean; // Whether to include a header row (this defaults to the first row of the table)
  colors?: Colors; // Colors for borders, alternate rows and custom colors
  borders: Borders; // Border characters
}

export interface PartialTableOptions extends DeepPartial<TableOptions> {}

export interface FormatTableOptions
  extends Pick<TableOptions, "cellPadding" | "maxRowHeight"> {
  actualMaxColWidths: number[];
}

export type CellPos = "first" | "center" | "last";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
