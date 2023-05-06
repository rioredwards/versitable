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
        const paddedCell = padCell(cell, additionalPadding + cellPadding);
        if (insertRows[0] === undefined) {
          insertRows.push(newInsertRow(actualMaxColWidths, cellPadding));
        }
        insertRows[0][colIdx] = paddedCell;
      } else {
        // cell is too long, truncate cell and insert remainder into next row
        let sliceIdx = 0;
        while (sliceIdx < maxRowHeight) {
          const charAtSliceIdx = cell[sliceIdx * maxColWidth];
          if (charAtSliceIdx === undefined) break;
          const startSliceIdx = sliceIdx * maxColWidth;
          const endSliceIdx = maxColWidth + sliceIdx * maxColWidth;
          const slice = cell.substring(startSliceIdx, endSliceIdx);
          const additionalPadding = maxColWidth - countCharsWithEmojis(slice);
          const paddedSlice = padCell(slice, additionalPadding + cellPadding);
          // Check if new row is needed
          if (insertRows[sliceIdx] === undefined) {
            insertRows.push(newInsertRow(actualMaxColWidths, cellPadding));
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

function createHorizontalBorder(
  colWidths: number[],
  glyphs: BorderGlyphs,
  type: "top" | "bottom" | "between",
  sides: BorderSides
) {
  let border: string[] = [];
  const {
    topLeftCorner,
    topRightCorner,
    bottomLeftCorner,
    bottomRightCorner,
    topSeparator,
    bottomSeparator,
    leftSeparator,
    rightSeparator,
    middleSeparator,
    horizontalLine,
  } = glyphs;

  let leftCorner: string;
  let rightCorner: string;
  let separator: string;

  switch (type) {
    case "top":
      leftCorner = topLeftCorner;
      rightCorner = topRightCorner;
      separator = topSeparator;
      break;
    case "bottom":
      leftCorner = bottomLeftCorner;
      rightCorner = bottomRightCorner;
      separator = bottomSeparator;
      break;
    case "between":
      leftCorner = leftSeparator;
      rightCorner = rightSeparator;
      separator = middleSeparator;
    default:
      break;
  }

  colWidths.forEach((colWidth, idx) => {
    // Border segment is the length of the column
    let borderSegment = horizontalLine.repeat(colWidth);
    // If there are borders between columns add the separator
    if (idx === 0) {
      // Far left column
      if (sides.left) border.push(leftCorner, borderSegment);
      else border.push(borderSegment);
      if (sides.betweenColumns) border.push(separator);
    } else if (idx === colWidths.length - 1) {
      // Far right column
      if (sides.right) border.push(borderSegment + rightCorner);
      else border.push(borderSegment);
    } else {
      // Middle column
      border.push(borderSegment);
      if (sides.betweenColumns) border.push(separator);
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
    updatedBorders = deepMerge(
      TABLE_DEFAULTS.borders,
      borders
    ) as CustomBorders;
  }

  const { sides, glyphs } = updatedBorders;
  const { verticalLine } = glyphs;

  // Insert betweenRow borders
  if (sides.betweenRows === true) {
    // insert one between every row
    for (let i = 1; i < tableWithBorders.length; i += 2) {
      const bottomBorder = createHorizontalBorder(
        colWidthsWithPadding,
        glyphs,
        "between",
        sides
      );
      tableWithBorders.splice(i, 0, bottomBorder);
    }
  }

  // Insert top border
  if (sides.top === true) {
    const topBorder = createHorizontalBorder(
      colWidthsWithPadding,
      glyphs,
      "top",
      sides
    );
    tableWithBorders.unshift(topBorder);
  }

  // Insert bottom border
  if (sides.bottom === true) {
    const bottomBorder = createHorizontalBorder(
      colWidthsWithPadding,
      glyphs,
      "bottom",
      sides
    );
    tableWithBorders.push(bottomBorder);
  }

  // Insert left border
  if (sides.left === true) {
    tableWithBorders = tableWithBorders.map((row, idx) => {
      // skip if top row and top border is set
      if (idx === 0 && sides.top) return row;
      // skip if bottom row and bottom border is set
      if (idx === tableWithBorders.length - 1 && sides.bottom) return row;
      // if betweenRows is set, skip even rows
      // but if no top border set, skip odd rows
      if (sides.betweenRows) {
        if (sides.top && idx % 2 === 0) return row;
        if (!sides.top && idx % 2 === 1) return row;
      }
      return [verticalLine, ...row];
    });
  }

  // Insert right border
  if (sides.right === true) {
    tableWithBorders = tableWithBorders.map((row, idx) => {
      // skip if top row and top border is set
      if (idx === 0 && sides.top) return row;
      // skip if bottom row and bottom border is set
      if (idx === tableWithBorders.length - 1 && sides.bottom) return row;
      // if betweenRows is set, skip even rows
      // but if no top border set, skip odd rows
      if (sides.betweenRows) {
        if (sides.top && idx % 2 === 0) return row;
        if (!sides.top && idx % 2 === 1) return row;
      }
      return [...row, verticalLine];
    });
  }

  // Insert betweenColumn borders
  if (sides.betweenColumns === true) {
    tableWithBorders = tableWithBorders.map((row, idx) => {
      // skip if top row and top border is set
      if (idx === 0 && sides.top) return row;
      // skip if bottom row and bottom border is set
      if (idx === tableWithBorders.length - 1 && sides.bottom) return row;
      // if betweenRows is set, skip even rows
      // but if no top border set, skip odd rows
      if (sides.betweenRows) {
        if (sides.top && idx % 2 === 0) return row;
        if (!sides.top && idx % 2 === 1) return row;
      }
      return row.map((cell, colIdx) => {
        // // If in the first column, skip if left border is set
        if (colIdx === 0 && sides.left) return cell;
        // Skip last column either way
        if (colIdx === row.length - 1) return cell;
        // Skip last two columns if right border is set
        if (colIdx === row.length - 2 && sides.right) return cell;
        return `${cell}${verticalLine}`;
      });
    });
  }

  return tableWithBorders;
}

function deepMerge<T>(defaults: T, options: Partial<T>): T {
  const result: any = {};

  for (const key in defaults) {
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      if (
        typeof defaults[key] === "object" &&
        Array.isArray(defaults[key]) &&
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
  if (options && optionChecks) checkTableOptionsAreValid(options);

  const limitedRows = limitRows(table, maxRows);
  const actualMaxColumns = Math.min(maxColumns, table[0].length);
  const limitedColumns = limitColumns(limitedRows, actualMaxColumns);

  const cellLengths = getCellLengths(limitedColumns);
  const actualMaxColWidths = getActualMaxColWidths(cellLengths, maxColWidths);

  const formattedCells = formatTable(limitedColumns, cellLengths, {
    cellPadding,
    actualMaxColWidths,
    maxRowHeight,
  });

  const colWidthsWithPadding = actualMaxColWidths.map(
    (width) => width + cellPadding
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
