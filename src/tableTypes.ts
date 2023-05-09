export interface VersitableType {
  _table: string[][];
  _options: TableOptions;
  _cellLengths: number[][];
  _colWidths: number[];
  _overFlowRowIdxs?: number[];
  _borderRowIdxs: SignificantIndicesType;
  _borderColumnsIdxs: number[];

  constructor: Function;

  // Mutations to formattedTable
  limitRows(): void;
  limitCols(): void;
  splitCells(): void;
  padCells(): void;
  addBorders(): void;

  // Calculations for table properties
  calcCellLengths(): number[][];
  calcColWidths(): number[];

  // Helper methods
  insertHorizontalBorder(type: HorizontalBorderType): void;
  insertVerticalBorder(type: VerticalBorderType): void;
  populateArrFromMaxColWidths(): number[];
  populateBordersOptWithDefaults(): void;
  findLongestStrLenInCol(): number[];
  createNewInsertRow(): string[];
  getGlyphsForBorderType(type: HorizontalBorderType): HorizontalGlyphs;
  getGlyphsForBorderType(type: VerticalBorderType): VerticalGlyphs;
  createHorizontalBorder(type: HorizontalBorderType): string[];
  createVerticalBorder(row: string[], border: VerticalBorderType): string[];

  // Validation methods
  validateTable(table: string[][]): void;
  validateOptions(options: PartialTableOptions): void;
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

export type HorizontalBorderType = "top" | "bottom" | "betweenRows";

export type VerticalBorderType = "left" | "right" | "betweenColumns";

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

export type HorizontalGlyphs = {
  leftEdge: string;
  rightEdge: string;
  separator: string;
};

export type VerticalGlyphs = {
  verticalLine: string;
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

export interface AddBordersOptions {
  colWidthsWithPadding: number[];
  borders: Borders;
}

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export interface SignificantIndicesType {
  _indices: number[];

  constructor: Function;
  length: number;
  indices: number[];
  addIndex: (idx: number) => void;
  addIndices: (idx: number[]) => void;
}
