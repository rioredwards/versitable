import {
  BorderGlyphs,
  Borders,
  CustomBorders,
  FormatTableOptions,
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

export let overflowRowIdxs: number[] = [];

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
    // If insertRows > 1, add the overflow rows indices to the overflowRowIdxs array
    if (insertRows.length > 1) {
      // The overflow rows are any rows after the first index of the insertRows array
      // These represent the rows that were split from the original row
      const overflowRowIdxsToAdd = insertRows
        .map((_, idx) => idx + formattedRows.length)
        .slice(1);
      overflowRowIdxs = overflowRowIdxs.concat(overflowRowIdxsToAdd);
    }
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
  let leftEdge: string;
  let rightEdge: string;
  let separator: string;
  let horizontalLine = glyphs.horizontalLine;
  switch (type) {
    case "top":
      leftEdge = glyphs.topLeftCorner;
      rightEdge = glyphs.topRightCorner;
      separator = glyphs.topSeparator;
      break;
    case "bottom":
      leftEdge = glyphs.bottomLeftCorner;
      rightEdge = glyphs.bottomRightCorner;
      separator = glyphs.bottomSeparator;
      break;
    case "between":
      leftEdge = glyphs.leftSeparator;
      rightEdge = glyphs.rightSeparator;
      separator = glyphs.middleSeparator;
    default:
      break;
  }

  colWidths.forEach((colWidth, idx) => {
    // Border segment is the length of the column
    let borderSegment = horizontalLine.repeat(colWidth);
    // If there are borders between columns add the separator
    if (idx === 0) {
      // Far left column
      if (sides.left) border.push(leftEdge, borderSegment);
      else border.push(borderSegment);
      if (sides.betweenColumns) border.push(separator);
    } else if (idx === colWidths.length - 1) {
      // Far right column
      if (sides.right) border.push(borderSegment, rightEdge);
      else border.push(borderSegment);
    } else {
      // Middle column
      border.push(borderSegment);
      if (sides.betweenColumns) border.push(separator);
    }
  });

  return border;
}

function createVerticalBorder(
  table: string[][],
  border: "left" | "right" | "between",
  sides: BorderSides,
  verticalLine: string
) {
  const updatedTable = table.map((row, idx) => {
    // skip if top row and top border is set
    if (idx === 0 && sides.top) return row;
    // skip if bottom row and bottom border is set
    if (idx === table.length - 1 && sides.bottom) return row;
    // if betweenRows is set, skip even rows
    // but if no top border set, skip odd rows
    if (sides.betweenRows) {
      if (sides.top && idx % 2 === 0) return row;
      if (!sides.top && idx % 2 === 1) return row;
    }
    if (border === "left") return [verticalLine, ...row];
    else if (border === "right") return [...row, verticalLine];
    else {
      // border === "between"
      return row.map((cell, colIdx) => {
        // // If in the first column, skip if left border is set
        if (colIdx === 0 && sides.left) return cell;
        // Skip last column either way
        if (colIdx === row.length - 1) return cell;
        // Skip last two columns if right border is set
        if (colIdx === row.length - 2 && sides.right) return cell;
        return `${cell}${verticalLine}`;
      });
    }
  });
  return updatedTable as string[][];
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
  if (sides.top) {
    const topBorder = createHorizontalBorder(
      colWidthsWithPadding,
      glyphs,
      "top",
      sides
    );
    tableWithBorders.unshift(topBorder);
  }

  // Insert bottom border
  if (sides.bottom) {
    const bottomBorder = createHorizontalBorder(
      colWidthsWithPadding,
      glyphs,
      "bottom",
      sides
    );
    tableWithBorders.push(bottomBorder);
  }

  // Insert left border
  if (sides.left) {
    tableWithBorders = createVerticalBorder(
      tableWithBorders,
      "left",
      sides,
      verticalLine
    );
  }

  // Insert right border
  if (sides.right) {
    tableWithBorders = createVerticalBorder(
      tableWithBorders,
      "right",
      sides,
      verticalLine
    );
  }

  // Insert betweenColumn borders
  if (sides.betweenColumns) {
    tableWithBorders = createVerticalBorder(
      tableWithBorders,
      "between",
      sides,
      verticalLine
    );
  }

  return tableWithBorders;
}

function deepMerge<T>(defaults: T, options: Partial<T>): T {
  const result: any = {};

  for (const key in defaults) {
    // Loop through all properties in defaults object
    if (Object.prototype.hasOwnProperty.call(defaults, key)) {
      // If the property is an object, but not an array,
      // And it's also an object in options, merge recursively
      if (
        typeof defaults[key] === "object" &&
        typeof options[key] === "object" &&
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
  if (overflowRowIdxs.length > 0) overflowRowIdxs = [];
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

  // console.log("overflowRowIdxs: ", overflowRowIdxs);

  return withBorders;
}

export function log(table: Table) {
  const joinedTable = table.map((row) => row.join("")).join("\n");
  console.log(joinedTable);
}

export const versitable = {
  create,
  log,
};
