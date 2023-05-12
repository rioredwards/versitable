import { TableOptions } from "./tableTypes";

/* Defaults */
const VALIDATION_MODE = "error";
const CELL_PADDING = 2;
const MAX_COLUMNS = 6;
const MAX_ROWS = 100;
const MAX_COL_WIDTHS = 40;
const MAX_ROW_HEIGHT = 1;
const HEADER = true;
// Color Options
const BORDER_COLOR = "#ce5e08";
const ALTERNATE_ROWS = ["#b18026", "red", "#3b59aa"];
const TARGET_CELLS_COLORS = undefined;
// Border Options
const HORIZONTAL_LINE = "─";
const VERTICAL_LINE = "│";
const TOP_LEFT_CORNER = "╭";
const TOP_RIGHT_CORNER = "╮";
const BOTTOM_LEFT_CORNER = "╰";
const BOTTOM_RIGHT_CORNER = "╯";
const TOP_SEPARATOR = "┬";
const BOTTOM_SEPARATOR = "┴";
const MIDDLE_SEPARATOR = "┼";
const RIGHT_SEPARATOR = "┤";
const LEFT_SEPARATOR = "├";

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
    targetCells: TARGET_CELLS_COLORS,
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
