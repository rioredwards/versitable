import { countCharsWithEmojis } from "./emojis.js";
import { Table, TableOptions } from "./tableTypes.js";
import { TABLE_DEFAULTS } from "./tableDefaults.js";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations.js";

const temp_table = [
  ["test1", "test2"],
  ["test3", "test4"],
];

// /* Helper functions for limiting/trimming cells */
// function limitRows(table: string[][], max: number) {
//   if (table.length <= max) return table;
//   return table.slice(0, max);
// }

// /* Helper functions for limiting/trimming cells */
// function custom_CoLORSPadEnd(str: string, length: number, fill: string = " ") {
//   const chars = countCharsWithEmojis(str);
//   return str + fill.repeat(length - chars);
// }

// function getColumns(table: string[][]) {
//   if (table.length === 0) return [];
//   if (table.length === 1) return table;
//   return table[0].map((_, i) => table.map((row) => row[i]));
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

export function create(cells: any[][], options?: TableOptions) {
  const {
    maxColumns,
    maxRows,
    maxColWidths,
    maxRowHeight,
    topAndBottomBorder,
    header,
    colors,
  } = { ...TABLE_DEFAULTS, ...options };

  // Guard clauses
  checkTableIsValid(cells);
  if (options) checkTableOptionsAreValid(cells, options);
  console.log("cells: ", cells);

  // Trim rows, columns and truncate cells
  // const limitedRows = limitRows(cells, maxRows);
  // const trimmedCells = cells.map((row) => row.map((cell) => cell.trim()));
  // const truncatedCells = truncateCells(trimmedCells);
  // const columns = getColumns(truncatedCells);
  // const columnWidths = getColumnMaxWidths(columns);
  // const formattedTable = formatTable(truncatedCells, columnWidths);
  // const formattedWidths = getFormattedColumnWidths(columnWidths);
  // const topRow = createTopOrBottom("top", formattedWidths);
  // const bottomRow = createTopOrBottom("bottom", formattedWidths);

  // const result = topAndBottomBorder
  //   ? [topRow, ...formattedTable, bottomRow]
  //   : formattedTable;

  return temp_table;
}

export function log(table: Table, options?: TableOptions) {
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
