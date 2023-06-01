import { Cell } from "./Cell";
import { StyledCell } from "./StyledCell";

export type Coords = [number, number];

export type AnyCellType = Cell | StyledCell;

export type FilterFn = (val: any, idx: any) => boolean;

export type RowType =
  | "primary"
  | "overflow"
  | "upperBorder"
  | "lowerBorder"
  | "innerBorder";

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

export const borderSides = [
  "top",
  "right",
  "bottom",
  "left",
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
  styles: Styles; // Styles for borders, alternate rows and targetCells colors
  borders: Borders; // AnyBorder sides and glyphs
}

export interface PartialTableOptions extends DeepPartial<TableOptions> {}

export type OptionChecks = "error" | "warn" | "skip";

export type Styles = Partial<CustomStyles> | boolean;

export type Borders = DeepPartial<CustomBorders> | boolean;

export type ComplexOptions = "borders" | "styles";

export interface CustomStyles {
  borderStyle: PartialCellStyle;
  rowStyles: PartialCellStyle[];
  targetCellStyles: TargetCellStyle[];
  blend: Blend;
}

export type Blend = boolean;

export interface StyleObj {
  modifier?: string;
  fgColor?: string;
  bgColor?: string;
}

// must have either fgColor or bgColor specified, but not necessarily both
export type PartialCellStyle = StyleObj &
  (
    | { fgColor: string; bgColor?: string }
    | { fgColor?: string; bgColor: string }
  );

// must have either row or column specified, but not necessarily both
export type TargetCellStyle = PartialCellStyle &
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
