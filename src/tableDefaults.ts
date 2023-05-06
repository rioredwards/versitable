import { TableOptions } from "./tableTypes";

/* Defaults */
const VALIDATION_MODE = "error";
const CELL_PADDING = 2;
const MAX_COLUMNS = 12;
const MAX_ROWS = 100;
const MAX_COL_WIDTHS = 20;
const MAX_ROW_HEIGHT = 3;
const HEADER = true;
// Color Options
const BORDER_COLOR = "grey";
const ALTERNATE_ROWS = ["#2323232a", "#2c2c2c2a"];
const CUSTOM_COLORS = undefined;
// Border Options
export const HORIZONTAL_LINE = "─";
export const VERTICAL_LINE = "│";
export const TOP_LEFT_CORNER = "╭";
export const TOP_RIGHT_CORNER = "╮";
export const BOTTOM_LEFT_CORNER = "╰";
export const BOTTOM_RIGHT_CORNER = "╯";
export const TOP_SEPARATOR = "┬";
export const BOTTOM_SEPARATOR = "┴";
export const MIDDLE_SEPARATOR = "┼";
export const RIGHT_SEPARATOR = "┤";
export const LEFT_SEPARATOR = "├";

export const TABLE_DEFAULTS: TableOptions = {
  optionChecks: VALIDATION_MODE,
  cellPadding: CELL_PADDING,
  maxColumns: MAX_COLUMNS,
  maxRows: MAX_ROWS,
  maxColWidths: MAX_COL_WIDTHS,
  maxRowHeight: MAX_ROW_HEIGHT,
  header: HEADER,
  colors: {
    borderColor: BORDER_COLOR,
    alternateRows: ALTERNATE_ROWS,
    customColors: CUSTOM_COLORS,
  },
  borders: {
    glyphs: {
      horizontalLine: HORIZONTAL_LINE,
      verticalLine: VERTICAL_LINE,
      topLeftCorner: TOP_LEFT_CORNER,
      topRightCorner: TOP_RIGHT_CORNER,
      bottomLeftCorner: BOTTOM_LEFT_CORNER,
      bottomRightCorner: BOTTOM_RIGHT_CORNER,
      topSeparator: TOP_SEPARATOR,
      bottomSeparator: BOTTOM_SEPARATOR,
      middleSeparator: MIDDLE_SEPARATOR,
      rightSeparator: RIGHT_SEPARATOR,
      leftSeparator: LEFT_SEPARATOR,
    },
    sides: {
      top: true,
      bottom: true,
      left: true,
      right: true,
      betweenColumns: true,
      betweenRows: false,
    },
  },
};
