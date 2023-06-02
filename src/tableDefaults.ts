import { TableOptions } from "./tableTypes";

export const TABLE_DEFAULTS: TableOptions = {
  optionChecks: "error",
  cellPadding: 2,
  textAlign: "center",
  maxColumns: 6,
  maxRows: 100,
  maxColWidths: 40,
  maxRowHeight: 2,
  header: undefined,
  styles: {
    headerStyle: {
      fgColor: "#e0e0e0",
      bgColor: "#2f2f2f",
      modifier: "bold",
    },
    borderStyle: {
      fgColor: "#e0e0e0",
      bgColor: "#2f2f2f",
      modifier: undefined,
    },
    rowStyles: [
      { fgColor: "#e0e0e0", bgColor: "#3c3c3c", modifier: undefined },
      { fgColor: "#e0e0e0", bgColor: "#2f2f2f", modifier: undefined },
    ],
    targetCellStyles: undefined,
    blend: true,
  },
  borders: {
    glyphs: {
      horizontalLine: "─",
      verticalLine: "│",
      topLeftCorner: "╭",
      topRightCorner: "╮",
      bottomLeftCorner: "╰",
      bottomRightCorner: "╯",
      topSeparator: "┬",
      bottomSeparator: "┴",
      middleSeparator: "┼",
      rightSeparator: "┤",
      leftSeparator: "├",
    },
    positions: {
      top: true,
      bottom: true,
      left: true,
      right: true,
      betweenColumns: true,
      betweenRows: false,
      underHeader: true,
    },
  },
};
