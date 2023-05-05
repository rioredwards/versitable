import { FormatTableOptions, Table, TableOptions } from "./tableTypes";
import { TABLE_DEFAULTS } from "./tableDefaults";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations";
import { countCharsWithEmojis } from "./emojis";

export function getCellLengths(table: string[][]) {
  const cellLengths: number[][] = table.map((row) => {
    return row.map((cell) => {
      return countCharsWithEmojis(cell);
    });
  });

  return cellLengths;
}

export function getActualMaxColWidths(
  cellLengths: number[][],
  maxColWidthsOption: number[] | number
) {
  const maxColWidthsOptionArray = arrayFromMaxColOpt(
    cellLengths,
    maxColWidthsOption
  );
  const maxCharsPerColumn = longestStringInColumns(cellLengths);

  const actualMaxColWidths = cellLengths[0].map((_, colIdx) => {
    return Math.min(maxColWidthsOptionArray[colIdx], maxCharsPerColumn[colIdx]);
  });

  return actualMaxColWidths;
}

export function longestStringInColumns(lengths: number[][]) {
  return lengths[0].map((_, colIdx) => {
    return lengths.reduce((maxLength, row) => {
      return Math.max(maxLength, row[colIdx]);
    }, 0);
  });
}

export function arrayFromMaxColOpt(
  lengths: number[][],
  maxColWidthsOption: number[] | number
) {
  // format maxColWidthsOption
  if (typeof maxColWidthsOption === "number") {
    return Array(lengths[0].length).fill(maxColWidthsOption);
  } else if (maxColWidthsOption.length < lengths[0].length) {
    // This extends the maxColWidthsOption array to match the number of columns in the table
    const defaultWidthsArr = Array(
      lengths[0].length - maxColWidthsOption.length
    ).fill(TABLE_DEFAULTS.maxColWidths);
    return maxColWidthsOption.concat(defaultWidthsArr);
  } else {
    return maxColWidthsOption;
  }
}

export function limitRows(table: string[][], max: number) {
  if (table.length > max) return table.slice(0, max);
  return table;
}

export function limitColumns(table: string[][], max: number) {
  if (table.length === 0) return [];
  if (table.length === 1) return table;
  const result: string[][] = [];
  for (const row of table) {
    result.push(row.slice(0, max));
  }
  return result;
}

// function truncateCell(
//   cell: string,
//   maxColWidth: number,
//   cutOffString: "..." | "-"
// ) {
//   // Truncate cell if it exceeds maxColWidth
//   if (maxColWidth! - cutOffString.length >= 3) {
//     // Room for cutOffString
//     return cell.substring(0, maxColWidth! - 3) + cutOffString;
//   } else {
//     // No room for cutOffString
//     return cell.substring(0, maxColWidth!);
//   }
// }

export function splitCell(cell: string, maxColWidth: number) {
  const firstSlice = cell.slice(0, maxColWidth);
  const secondSlice = cell.slice(maxColWidth);
  return [firstSlice, secondSlice];
}

export function padCell(cell: string, cellPadding: number) {
  if (cellPadding > 0) return cell + " ".repeat(cellPadding);
  else return cell;
}

export function newInsertRow(maxColWidths: number[], cellPadding: number) {
  return maxColWidths.map((maxColWidth) => {
    return " ".repeat(maxColWidth + cellPadding);
  });
}

export function formatTable(
  table: string[][],
  lengths: number[][],
  { cellPadding, actualMaxColWidths, maxRowHeight }: FormatTableOptions
) {
  let formattedRows: string[][] = [];
  table.forEach((row, rowIdx) => {
    let insertRows: string[][] = [];

    row.forEach((cell, colIdx) => {
      const cellLength = lengths[rowIdx][colIdx];
      const maxColWidth = actualMaxColWidths[colIdx];

      if (cellLength <= maxColWidth) {
        const additionalPadding = maxColWidth - cellLength;
        const paddedCell = padCell(cell, additionalPadding + cellPadding!);
        if (insertRows[0] === undefined) {
          insertRows.push(newInsertRow(actualMaxColWidths, cellPadding!));
        }
        insertRows[0][colIdx] = paddedCell;
      } else {
        let sliceIdx = 0;
        // if cell is too long and maxRowHeight is greater than 1, truncate cell and insert remainder into next row
        while (sliceIdx < maxRowHeight!) {
          const charAtSliceIdx = cell[sliceIdx * maxColWidth!];
          if (charAtSliceIdx === undefined) break;
          const startSliceIdx = sliceIdx * maxColWidth!;
          const endSliceIdx = maxColWidth! + sliceIdx * maxColWidth!;
          const slice = cell.substring(startSliceIdx, endSliceIdx);
          const additionalPadding = maxColWidth - countCharsWithEmojis(slice);
          const paddedSlice = padCell(slice, additionalPadding + cellPadding!);
          // Check if new row is needed
          if (insertRows[sliceIdx] === undefined) {
            insertRows.push(newInsertRow(actualMaxColWidths, cellPadding!));
          }
          insertRows[sliceIdx][colIdx] = paddedSlice;
          sliceIdx++;
        }
      }
    });
    formattedRows = formattedRows.concat(insertRows);
  });
  return formattedRows;
}

// Creates a valid table from a 2D array of cells
export function create(table: string[][], options?: Partial<TableOptions>) {
  const {
    optionChecks: OptionChecks,
    maxRows,
    maxColumns,
    cellPadding,
    maxColWidths,
    maxRowHeight,
    topAndBottomBorder,
    header,
    colors,
  } = { ...TABLE_DEFAULTS, ...options } as TableOptions;

  checkTableIsValid(table);
  if (options) checkTableOptionsAreValid(options);

  const limitedRows = limitRows(table, maxRows!);
  const actualMaxColumns = Math.min(maxColumns!, table[0].length);
  const limitedColumns = limitColumns(limitedRows, actualMaxColumns!);

  const cellLengths = getCellLengths(limitedColumns);
  const actualMaxColWidths = getActualMaxColWidths(cellLengths, maxColWidths!);

  const formattedCells = formatTable(limitedColumns, cellLengths, {
    cellPadding,
    actualMaxColWidths,
    maxRowHeight,
  });

  return formattedCells;
}

export function log(table: Table, options?: Partial<TableOptions>) {
  const createdTable = create(table, options);
  const joinedTable = createdTable.map((row) => row.join("")).join("\n");
  console.log(joinedTable);
}

export const versitable = {
  create,
  log,
};
