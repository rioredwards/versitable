import { TableOptions } from "./tableTypes";

/* Defaults */
const VALIDATION_MODE = "error";
const CELL_PADDING = 2;
const MAX_COLUMNS = 12;
const MAX_ROWS = 100;
const MAX_COL_WIDTHS = 20;
const MAX_ROW_HEIGHT = 3;
const TOP_AND_BOTTOM_BORDER = true;
const HEADER = true;
const BORDER_COLOR = "grey";
const ALTERNATE_ROWS = ["#2323232a", "#2c2c2c2a"];
const CUSTOM_COLORS = undefined;
const HORIZONTAL_LINE = "─";
const VERTICAL_LINE = "│";
const TOP_LEFT_CORNER = "╭";
const TOP_RIGHT_CORNER = "╮";
const BOTTOM_LEFT_CORNER = "╰";
const BOTTOM_RIGHT_CORNER = "╯";
const TOP_SEPARATOR = "┬";
const BOTTOM_SEPARATOR = "┴";

export const TABLE_DEFAULTS: TableOptions = {
  optionChecks: VALIDATION_MODE,
  cellPadding: CELL_PADDING,
  maxColumns: MAX_COLUMNS,
  maxRows: MAX_ROWS,
  maxColWidths: MAX_COL_WIDTHS,
  maxRowHeight: MAX_ROW_HEIGHT,
  topAndBottomBorder: TOP_AND_BOTTOM_BORDER,
  header: HEADER,
  colors: {
    borderColor: BORDER_COLOR,
    alternateRows: ALTERNATE_ROWS,
    customColors: CUSTOM_COLORS,
  },
  borders: {
    horizontalLine: HORIZONTAL_LINE,
    verticalLine: VERTICAL_LINE,
    topLeftCorner: TOP_LEFT_CORNER,
    topRightCorner: TOP_RIGHT_CORNER,
    bottomLeftCorner: BOTTOM_LEFT_CORNER,
    bottomRightCorner: BOTTOM_RIGHT_CORNER,
    topSeparator: TOP_SEPARATOR,
    bottomSeparator: BOTTOM_SEPARATOR,
  },
};
