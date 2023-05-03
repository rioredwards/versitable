export type Table = any[][];

export interface CustomColors {
  column?: number;
  row?: number;
  style: string;
  fgColor: string;
  bgColor: string;
}

export interface Colors {
  borderColor?: string;
  alternateRows?: string[];
  customColors?: CustomColors[] | undefined;
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
  strict?: boolean; // Errors or warnings
  cellPadding?: number; // Padding between cell content and cell border (minimum if cells vary in length) (end of cell only)
  maxColumns?: number; // Maximum number of columns
  maxRows?: number; // Maximum number of rows
  maxColWidths?: number[] | number; // Maximum column widths (doesn't include padding)
  maxRowHeight?: number; // Lines of text per cell (only applies if cell content will be truncated)
  topAndBottomBorder?: boolean; // Whether to include a top and bottom border
  header?: boolean; // Whether to include a header row (this defaults to the first row of the table)
  colors?: Colors; // Colors for borders, alternate rows and custom colors
  borders?: Borders; // Border characters
}

export type CellPos = "first" | "center" | "last";
