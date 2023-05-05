export type Table = any[][];

export type ValidationMode = "error" | "warn" | "skipChecks";

export interface CustomColors {
  column?: number;
  row?: number;
  style?: string;
  fgColor?: string;
  bgColor?: string;
}

export interface Colors {
  borderColor: string;
  alternateRows: string[];
  customColors: CustomColors[] | undefined;
}

export interface Borders {
  horizontalLine: string;
  verticalLine: string;
  topLeftCorner: string;
  topRightCorner: string;
  bottomLeftCorner: string;
  bottomRightCorner: string;
  topSeparator: string;
  bottomSeparator: string;
}

export interface TableOptions {
  validationMode: ValidationMode; // Should createTable throw errors, warnings or skip checks altogether?
  cellPadding: number; // Padding between cell content and cell border (minimum if cells vary in length) (end of cell only)
  maxColumns: number; // Max number of columns
  maxRows: number; // Max number of rows (not including "overflow rows": rows with height > 1)
  maxColWidths: number[] | number; // Max column widths (doesn't include padding)
  maxRowHeight: number; // Lines of text per cell (only applies if cell content will be truncated)
  topAndBottomBorder: boolean; // Whether to include a top and bottom border
  header: boolean; // Whether to include a header row (this defaults to the first row of the table)
  colors?: Colors; // Colors for borders, alternate rows and custom colors
  borders: Borders; // Border characters
}

export interface FormatTableOptions
  extends Pick<TableOptions, "cellPadding" | "maxRowHeight"> {
  actualMaxColWidths: number[];
}

export type CellPos = "first" | "center" | "last";
