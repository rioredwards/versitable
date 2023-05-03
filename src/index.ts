import { Table, TableOptions } from "./tableTypes";
import { TABLE_DEFAULTS } from "./tableDefaults";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations";
import { countCharsWithEmojis } from "./emojis";

// /* Helper functions for limiting/trimming cells */
function limitRows(table: string[][], max: number) {
  if (table.length > max) return table.slice(0, max);
  return table;
}

function limitColumns(table: string[][], max: number) {
  if (table.length === 0) return [];
  if (table.length === 1) return table;
  const result: string[][] = [];
  for (const row of table) {
    result.push(row.slice(0, max));
  }
  return result;
}

function truncateCell(cell: string, cellWidth: number, maxColWidth: number) {
  // Return cell if it doesn't exceed maxColWidth
  if (cellWidth < maxColWidth) return cell;
  // Truncate cell if it exceeds maxColWidth
  if (maxColWidth! - 3 >= 3) {
    // Room for ellipsis
    return cell.substring(0, maxColWidth! - 3) + "...";
  } else {
    // No room for ellipsis
    return cell.substring(0, maxColWidth!);
  }
}

function padCell(cell: string, cellPadding: number) {
  if (cellPadding > 0) return cell + " ".repeat(cellPadding);
  else return cell;
}

function formatCells(
  table: string[][],
  { cellPadding, maxColWidths }: TableOptions
) {
  const formattedRows = table.map((row, rowIdx) => {
    const formattedCells = row.map((cell, colIdx) => {
      const maxColWidth = Array.isArray(maxColWidths)
        ? maxColWidths[colIdx]
        : maxColWidths;
      const cellChars = countCharsWithEmojis(cell);

      const truncatedCell = truncateCell(cell, cellChars, maxColWidth!);
      const paddedCell = padCell(truncatedCell, cellPadding!);

      return paddedCell;
    });
    return formattedCells;
  });
  return formattedRows;
}

// /* Helper functions for limiting/trimming cells */
// function customPadEnd(str: string, length: number, fill: string = " ") {
//   const chars = countCharsWithEmojis(str);
//   return str + fill.repeat(length - chars);
// }

// function truncate(str: string, nun: number) {
//   return countCharsWithEmojis(str) > nun
//     ? str.substring(0, nun - 3) + "..."
//     : str;
// }

// function truncateCells(table: string[][]) {
//   return table.map((row) =>
//     row.map((cell, i) => truncate(cell, MAX_WIDTH_PER_COLUMN[i]))
//   );
// }

// function getColumnMaxWidths(columns: string[][]) {
//   const colMaxWidths = columns.map((column) => {
//     return Math.max(...column.map((cell) => countCharsWithEmojis(cell)));
//   });

//   return colMaxWidths;
// }

// function formatTable(table: string[][], colWidths: number[]) {
//   const formattedTable = table.map((row, i) => {
//     const color = i % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2;
//     const formattedRow = formatRow(row, colWidths, color);
//     return formattedRow.join("");
//   });

//   return formattedTable;
// }

// function formatRow(row: string[], colWidths: number[], color: string) {
//   const formattedRow = row.map((cell, i) => {
//     const cellPos =
//       i === 0 ? "first" : i === row.length - 1 ? "last" : "center";
//     let formattedCell = custom_CoLORSPadEnd(cell, colWidths[i]);
//     let coloredCells = "";

//     switch (cellPos) {
//       case "first":
//         coloredCells = chalk.bgHex(color)(padding + formattedCell + padding);
//         return verticalLine + coloredCells;

//       case "last":
//         coloredCells = chalk.bgHex(color)(padding + formattedCell + padding);
//         return coloredCells + verticalLine;

//       default:
//         coloredCells = chalk.bgHex(color)(
//           verticalLine + padding + formattedCell + padding + verticalLine
//         );
//         return coloredCells;
//     }
//   });
//   return formattedRow;
// }

// function getFormattedColumnWidths(columnWidths: number[]) {
//   const formattedColWidths = columnWidths.map((_, i) => {
//     if (i === 0 || i === columnWidths.length - 1) {
//       return columnWidths[i] + padding.length * 2 + verticalLine.length;
//     } else {
//       return columnWidths[i] + padding.length * 2 + verticalLine.length * 2;
//     }
//   });
//   return formattedColWidths;
// }

// function createTopOrBottom(rowPos: "top" | "bottom", colWidths: number[]) {
//   if (rowPos === "top") {
//     const topRow =
//       topLeftCorner +
//       colWidths
//         .map((width, i) => {
//           if (i === 0) return horizontalLine.repeat(width - 1);
//           else if (i === colWidths.length - 1)
//             return horizontalLine.repeat(width - 1);
//           else return horizontalLine.repeat(width - 2);
//         })
//         .join(topSeparator) +
//       topRightCorner;
//     return topRow;
//   } else {
//     const bottomRow =
//       bottomLeftCorner +
//       colWidths
//         .map((width, i) => {
//           if (i === 0) return horizontalLine.repeat(width - 1);
//           else if (i === colWidths.length - 1)
//             return horizontalLine.repeat(width - 1);
//           else return horizontalLine.repeat(width - 2);
//         })
//         .join(bottomSeparator) +
//       bottomRightCorner;
//     return bottomRow;
//   }
// }

// Creates a valid table from a 2D array of cells
function create(table: string[][], options?: TableOptions) {
  const {
    maxRows,
    maxColumns,
    cellPadding,
    maxColWidths,
    maxRowHeight,
    topAndBottomBorder,
    header,
    colors,
  } = { ...TABLE_DEFAULTS, ...options };

  // Guard clauses
  checkTableIsValid(table);
  if (options) checkTableOptionsAreValid(table, options);

  // Trim rows, columns and truncate cells
  const limitedRows = limitRows(table, maxRows!);
  const limitedColumns = limitColumns(limitedRows, maxColumns!);
  const formattedCells = formatCells(limitedColumns, {
    cellPadding,
    maxColWidths,
  });
  // console.log("truncatedCells: ", truncatedCells);
  // const columns = getColumns(truncatedCells);
  // const columnWidths = getColumnMaxWidths(columns);
  // const formattedTable = formatTable(truncatedCells, columnWidths);
  // const formattedWidths = getFormattedColumnWidths(columnWidths);
  // const topRow = createTopOrBottom("top", formattedWidths);
  // const bottomRow = createTopOrBottom("bottom", formattedWidths);

  // const result = topAndBottomBorder
  //   ? [topRow, ...formattedTable, bottomRow]
  //   : formattedTable;

  return formattedCells;
}

function log(table: Table, options?: TableOptions) {
  const createdTable = create(table, options);
  const joinedTable = createdTable.map((row) => row.join("")).join("\n");
  console.log(joinedTable);
  // createdTable.forEach((row) => {
  //   console.log(row.join(""));
  // });
}

export const versitable = {
  create,
  log,
};
