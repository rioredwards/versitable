import {
  BorderGlyphs,
  Borders,
  CustomBorders,
  FormatTableOptions,
  OptionChecks,
  Table,
  TableOptions,
  BorderSides,
} from "./tableTypes";
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
        // Cell is not too long, so just pad it + add it
        const additionalPadding = maxColWidth - cellLength;
        const paddedCell = padCell(cell, additionalPadding + cellPadding!);
        if (insertRows[0] === undefined) {
          insertRows.push(newInsertRow(actualMaxColWidths, cellPadding!));
        }
        insertRows[0][colIdx] = paddedCell;
      } else {
        // cell is too long, truncate cell and insert remainder into next row
        let sliceIdx = 0;
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

export interface AddBordersOptions {
  colWidthsWithPadding: number[];
  borders: Borders;
}

interface GenericGlyphs {
  leftCorner: string;
  rightCorner: string;
  separator: string;
  horizontalLine: string;
}

function createVertBorder(colWidths: number[], glyphs: GenericGlyphs) {
  let border: string[] = [];
  const { leftCorner, rightCorner, separator, horizontalLine } = glyphs;

  colWidths.forEach((colWidth, idx) => {
    if (idx === 0) {
      border.push(leftCorner, horizontalLine.repeat(colWidth));
    } else if (idx === colWidths.length - 1) {
      border.push(separator, horizontalLine.repeat(colWidth), rightCorner);
    } else {
      border.push(separator, horizontalLine.repeat(colWidth));
    }
  });

  return border;
}

export function addBorders(
  formattedRows: string[][],
  { colWidthsWithPadding, borders }: AddBordersOptions
): string[][] {
  let tableWithBorders: string[][] = formattedRows;
  let updatedBorders: CustomBorders;
  if (typeof borders === "boolean") {
    if (borders === false) return formattedRows;
    else updatedBorders = TABLE_DEFAULTS.borders as CustomBorders;
  } else {
    updatedBorders = {
      sides: {
        ...(TABLE_DEFAULTS.borders as CustomBorders).sides,
        ...borders.sides,
      } as BorderSides,
      glyphs: {
        ...(TABLE_DEFAULTS.borders as CustomBorders).glyphs,
        ...borders.glyphs,
      } as BorderGlyphs,
    };
  }

  const { sides, glyphs } = updatedBorders;

  // Insert top border
  if (sides!.top === true) {
    const {
      topLeftCorner: leftCorner,
      topRightCorner: rightCorner,
      topSeparator: separator,
      horizontalLine: horizontalLine,
    } = glyphs!;
    const topBorder = createVertBorder(colWidthsWithPadding, {
      leftCorner,
      rightCorner,
      separator,
      horizontalLine,
    } as GenericGlyphs);
    tableWithBorders.unshift(topBorder);
  }
  // Insert bottom border
  if (sides!.top === true) {
    const {
      bottomLeftCorner: leftCorner,
      bottomRightCorner: rightCorner,
      bottomSeparator: separator,
      horizontalLine: horizontalLine,
    } = glyphs!;
    const bottomBorder = createVertBorder(colWidthsWithPadding, {
      leftCorner,
      rightCorner,
      separator,
      horizontalLine,
    } as GenericGlyphs);
    tableWithBorders.push(bottomBorder);
  }

  return tableWithBorders;
}

interface searchable {
  [key: string]: any;
}

function deepMerge<T>(defaults: T, options: Partial<T>): T {
  const result: any = {};

  for (const key in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      if (
        typeof defaults[key] === "object" &&
        !Array.isArray(defaults[key]) &&
        options[key] !== undefined
      ) {
        result[key] = deepMerge(
          defaults[key],
          options[key] as Partial<T[Extract<keyof T, string>]>
        );
      } else {
        result[key] = options[key] !== undefined ? options[key] : defaults[key];
      }
    }
  }

  return result as T;
}

// Creates a valid table from a 2D array of cells
export function create(table: string[][], options?: Partial<TableOptions>) {
  const mergedOptions = deepMerge(TABLE_DEFAULTS, options || {});
  const {
    optionChecks,
    maxRows,
    maxColumns,
    cellPadding,
    maxColWidths,
    maxRowHeight,
    header,
    colors,
    borders,
  } = mergedOptions;

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

  const colWidthsWithPadding = actualMaxColWidths.map(
    (width) => width + cellPadding!
  );

  const withBorders = addBorders(formattedCells, {
    colWidthsWithPadding,
    borders,
  });

  return withBorders;
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
