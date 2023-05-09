import { countCharsWithEmojis } from "./emojis";
import { TABLE_DEFAULTS } from "./tableDefaults";
import {
  BorderSides,
  CustomBorders,
  HorizontalBorderType,
  HorizontalGlyphs,
  PartialTableOptions,
  TableOptions,
  VersitableType,
  VerticalBorderType,
  VerticalGlyphs,
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations";
import { deepMerge, insert2DArray, insertIntoSortedArray } from "./utils";

// This is the return type of the make() function.
// Users will interact with this class.
export class VersitableArray extends Array<string[]> {
  private _formattedTable: string[][];

  constructor(table: string[][]) {
    super(...table);
    this._formattedTable = table;
  }

  print(): void {
    const joinedTable = this._formattedTable
      .map((row) => row.join(""))
      .join("\n");
    console.log(joinedTable);
  }
}

// Main class which does all the work
export class Versitable implements VersitableType {
  _table: string[][];
  _options: TableOptions;
  _cellLengths: number[][];
  _colWidths: number[];
  _overFlowRowIdxs: number[] = []; // Calculated in splitCells()
  _borderRowIdxs: number[] = [];
  _borderColumnsIdxs: number[] = [];

  private constructor(
    inputTable: string[][],
    inputOptions?: PartialTableOptions
  ) {
    this.validateTable(inputTable);
    this.validateOptions(inputOptions);

    this._options = deepMerge(TABLE_DEFAULTS, inputOptions || {});
    this.populateBordersOptWithDefaults();
    this._table = inputTable;
    this.limitRows();
    this.limitCols();
    this._cellLengths = this.calcCellLengths();
    this._colWidths = this.calcColWidths();
    this.splitCells();
    this.padCells();
    this.addBorders();
  }

  // User-facing methods
  static make(inputTable: string[][], inputOptions?: PartialTableOptions) {
    const newTable = new Versitable(inputTable, inputOptions);
    return new VersitableArray(newTable._table);
  }

  // Mutations to table
  limitRows(): void {
    if (this._table.length > this._options.maxRows) {
      this._table.splice(this._options.maxRows);
    }
  }

  limitCols(): void {
    const actualMaxColumns = Math.min(
      this._options.maxColumns,
      this._table[0].length
    );
    for (const row of this._table) {
      row.splice(actualMaxColumns);
    }
  }

  splitCells(): void {
    let newTable: string[][] = [];
    let newCellLengths: number[][] = [];

    this._table.forEach((row, rowIdx) => {
      let insertRows: string[][] = [];
      let insertRowsCellLengths: number[][] = [];

      row.forEach((cell, colIdx) => {
        const cellLength = this._cellLengths[rowIdx][colIdx];
        const maxColWidth = this._colWidths[colIdx];

        if (cellLength <= maxColWidth) {
          // Cell is not too long, so just add it
          if (insertRows[0] === undefined) {
            insertRows.push(this.createNewInsertRow());
            insertRowsCellLengths.push([...this._colWidths]);
          }

          insertRows[0][colIdx] = cell;
          insertRowsCellLengths[0][colIdx] = cellLength;
        } else {
          // cell is too long, truncate cell and conditionally insert remainder into next row
          let sliceIdx = 0; // used with maxColWidth to calculate idx to slice string & used as rowIdx of slice in insertRows
          while (sliceIdx < this._options.maxRowHeight) {
            const charAtSliceIdx = cell[sliceIdx * maxColWidth];
            if (charAtSliceIdx === undefined) break;
            const startSliceIdx = sliceIdx * maxColWidth;
            const endSliceIdx = maxColWidth + sliceIdx * maxColWidth;
            const slice = cell.substring(startSliceIdx, endSliceIdx);

            // Check if new insertRow is needed
            if (insertRows[sliceIdx] === undefined) {
              insertRows.push(this.createNewInsertRow());
              insertRowsCellLengths.push([...this._colWidths]);
            }

            // Update insertRows and cellLengths arrays with new cell
            const newCellLength = countCharsWithEmojis(slice);
            insertRows[sliceIdx][colIdx] = slice;
            insertRowsCellLengths[sliceIdx][colIdx] = newCellLength;
            sliceIdx++;
          }
        }
      });
      // If insertRows.length > 1, add the insert row's indices to the overflowRowIdxs array
      // and update cellLengths array with cellLengths from overflowRowsCellLengths
      if (insertRows.length > 1) {
        // The overflow rows are any rows after the first index of the insertRows array
        // These represent the rows that were split from the original row
        // These indices should be skipped when adding borders between rows
        if (this._overFlowRowIdxs === undefined) {
          this._overFlowRowIdxs = [];
        }
        const newRowIdxs = insertRows
          .map((_, idx) => idx + newTable.length)
          .slice(1);
        this._overFlowRowIdxs.push(...newRowIdxs);
      }
      newCellLengths.push(...insertRowsCellLengths);
      newTable.push(...insertRows);
    });
    this._cellLengths = newCellLengths;
    this._table = newTable;
  }

  padCells(): void {
    this._table.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const cellLength = this._cellLengths[rowIdx][colIdx];
        const maxColWidth = this._colWidths[colIdx];
        const cellPadding =
          maxColWidth - cellLength + this._options.cellPadding;
        if (cellPadding > 0) {
          const padding = " ".repeat(cellPadding);
          this._table[rowIdx][colIdx] = cell + padding;
          this._cellLengths[rowIdx][colIdx] += cellPadding;
        }
      });
    });
    // Add padding to colWidths lengths
    this._colWidths.forEach((width, idx, arr) => {
      arr[idx] = width + this._options.cellPadding;
    });
  }

  updateBorderRowsAfterInsertion(insertIdxs: number[]): void {
    // InsertedBorderIdxs are the indices of the original table in which rows were inserted
    // To calculate the insertBorderIdxs, each index of the insertIdx array needs to be incremented
    // by the number of indices before it, which represent the number of borders inserted before that index
    const insertedBorderIdxs = insertIdxs.map((value, idx) => value + idx);
    insertedBorderIdxs.forEach((insertedBorderIdx) => {
      insertIntoSortedArray(this._borderRowIdxs, insertedBorderIdx);
    });
  }

  insertHorizontalBorder(type: HorizontalBorderType) {
    // Insert betweenRow borders
    if (type === "betweenRows") {
      let insertIdxs = [];
      for (let i = 1; i < this._table.length; i += 1) {
        if (this._overFlowRowIdxs.length > 0) {
          if (!this._overFlowRowIdxs.includes(i)) insertIdxs.push(i);
        } else {
          insertIdxs.push(i);
        }
      }
      // Iterate backwards through insertIdxs so that the indices don't change during insertion + slightly faster
      for (let i = insertIdxs.length - 1; i >= 0; i--) {
        const betweenBorder = this.createHorizontalBorder("betweenRows");
        this._table.splice(insertIdxs[i], 0, betweenBorder);
      }
      this.updateBorderRowsAfterInsertion(insertIdxs);
      // update this._overFlowRowIdxs
      // This requires mapping through the array and adding the number of borders inserted before that index (borderRowIdx) to each value
      // this._borderRowIdxs has the indices of each border row, so when the sum of overflowRowIdxs + borderRowIdx is greater than the value of the borderRowIdxs[borderRowIdx] (the next border row index)
      // then the overflowRowIdxs value needs to be incremented by the number of borders inserted before that index: AKA the borderRowIdx variable
      // and the borderRowIdx variable needs to be incremented by 1 to get the index of the next border row
      let borderRowIdx = 0;
      if (this._overFlowRowIdxs !== undefined) {
        this._overFlowRowIdxs = this._overFlowRowIdxs.map((value) => {
          while (
            borderRowIdx < this._borderRowIdxs.length &&
            value + borderRowIdx >= this._borderRowIdxs[borderRowIdx]
          ) {
            borderRowIdx++;
          }
          return value + borderRowIdx;
        });
      }
    }

    // Insert top border
    if (type === "top") {
      const topBorder = this.createHorizontalBorder("top");
      this._table.unshift(topBorder);
      // Update this._borderRowIdxs by adding 1 to each idx and adding 0 to the beginning
      this._borderRowIdxs = this._borderRowIdxs.map((value) => value + 1);
      this._borderRowIdxs.unshift(0);
      // Update this._overFlowRowIdxs by adding 1 to each idx
      if (this._overFlowRowIdxs !== undefined) {
        this._overFlowRowIdxs = this._overFlowRowIdxs.map((value) => value + 1);
      }
    }

    // Insert bottom border
    if (type === "bottom") {
      const bottomBorder = this.createHorizontalBorder("bottom");
      this._table.push(bottomBorder);
      // update this._borderRowIdxs
      this._borderRowIdxs.push(this._table.length - 1);
    }
  }

  insertVerticalBorder(type: VerticalBorderType) {
    const { sides } = this._options.borders as CustomBorders;

    const startIdx = sides.top ? 1 : 0;
    const endIdx = sides.bottom ? this._table.length - 1 : this._table.length;
    for (let i = startIdx; i < endIdx; i += 1) {
      const row = this._table[i];
      if (!this._borderRowIdxs.includes(i)) {
        this._table[i] = this.createVerticalBorder(row, type);
      }
    }
  }

  addBorders(): void {
    if (this._options.borders === false) return;
    const sides = (this._options.borders as CustomBorders).sides;

    // Insert horizontal borders
    if (sides.betweenRows) this.insertHorizontalBorder("betweenRows");
    if (sides.top) this.insertHorizontalBorder("top");
    if (sides.bottom) this.insertHorizontalBorder("bottom");
    // Insert vertical borders
    if (sides.left) this.insertVerticalBorder("left");
    if (sides.right) this.insertVerticalBorder("right");
    if (sides.betweenColumns) this.insertVerticalBorder("betweenColumns");
  }

  // Calculations for table properties
  calcCellLengths() {
    return this._table.map((row) => {
      return row.map((cell) => countCharsWithEmojis(cell));
    });
  }

  calcColWidths(): number[] {
    const maxColWidthsArr = this.populateArrFromMaxColWidths();
    const maxCharsPerColumn = this.findLongestStrLenInCol();

    return this._cellLengths[0].map((_, colIdx) => {
      return Math.min(maxColWidthsArr[colIdx], maxCharsPerColumn[colIdx]);
    });
  }

  // Helper functions
  populateArrFromMaxColWidths(): number[] {
    const numCols = this._table[0].length;
    const userMaxColWidths = this._options.maxColWidths;
    // format options.maxColWidths
    if (typeof userMaxColWidths === "number") {
      return Array(numCols).fill(userMaxColWidths);
    } else if (userMaxColWidths.length < numCols) {
      // This extends the options.maxColWidths array to match the number of columns in the table
      const defaultWidthsArr = Array(numCols - userMaxColWidths.length).fill(
        TABLE_DEFAULTS.maxColWidths
      );
      return userMaxColWidths.concat(defaultWidthsArr);
    } else {
      return userMaxColWidths;
    }
  }

  populateBordersOptWithDefaults(): void {
    if (typeof this._options.borders === "boolean") {
      if (this._options.borders === true) {
        this._options.borders = TABLE_DEFAULTS.borders as CustomBorders;
      } else return;
    } else {
      this._options.borders = deepMerge(
        TABLE_DEFAULTS.borders,
        this._options.borders
      ) as CustomBorders;
    }
  }

  findLongestStrLenInCol(): number[] {
    const lengths = this._cellLengths;
    return lengths[0].map((_, colIdx) => {
      return lengths.reduce((maxLength, row) => {
        return Math.max(maxLength, row[colIdx]);
      }, 0);
    });
  }

  createNewInsertRow(): string[] {
    return this._colWidths.map((colWidth) => {
      return " ".repeat(colWidth);
    });
  }

  getGlyphsForBorderType(type: HorizontalBorderType): HorizontalGlyphs;
  getGlyphsForBorderType(type: VerticalBorderType): VerticalGlyphs;
  getGlyphsForBorderType(
    type: HorizontalBorderType | VerticalBorderType
  ): HorizontalGlyphs | VerticalGlyphs {
    const { glyphs } = this._options.borders as CustomBorders;

    switch (type) {
      case "top":
        return {
          leftEdge: glyphs.topLeftCorner,
          rightEdge: glyphs.topRightCorner,
          separator: glyphs.topSeparator,
        };
      case "bottom":
        return {
          leftEdge: glyphs.bottomLeftCorner,
          rightEdge: glyphs.bottomRightCorner,
          separator: glyphs.bottomSeparator,
        };
      case "betweenRows":
        return {
          leftEdge: glyphs.leftSeparator,
          rightEdge: glyphs.rightSeparator,
          separator: glyphs.middleSeparator,
        };
      default:
        return { verticalLine: glyphs.verticalLine };
    }
  }

  createHorizontalBorder(type: HorizontalBorderType): string[] {
    const { sides, glyphs } = this._options.borders as CustomBorders;
    let border: string[] = [];
    let horizontalLine = glyphs.horizontalLine;
    const { leftEdge, rightEdge, separator } =
      this.getGlyphsForBorderType(type);

    const colWidths = this._colWidths;
    colWidths.forEach((colWidth, idx) => {
      // Border segment is the same length as the column
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

  createVerticalBorder(row: string[], type: VerticalBorderType): string[] {
    const { sides } = this._options.borders as CustomBorders;
    const { verticalLine } = this.getGlyphsForBorderType(type);

    if (type === "left") return [verticalLine, ...row];
    else if (type === "right") return [...row, verticalLine];
    else {
      // border === "betweenColumns"
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
  }

  // Validation methods
  validateTable(table: string[][]) {
    checkTableIsValid(table);
  }

  validateOptions(options: PartialTableOptions | undefined) {
    checkTableOptionsAreValid(options);
  }
}
