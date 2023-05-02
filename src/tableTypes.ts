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
  cellPadding?: number;
  maxColumns?: number;
  maxRows?: number;
  maxColWidths?: number[];
  maxRowHeight?: number;
  topAndBottomBorder?: boolean;
  header?: boolean;
  colors?: Colors;
  borders?: Borders;
}

export type CellPos = "first" | "center" | "last";
