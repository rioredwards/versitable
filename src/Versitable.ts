import { TABLE_DEFAULTS } from "./tableDefaults";
import {
  CellType,
  CustomBorders,
  CustomStyles,
  HorizontalBorder,
  HorizontalGlyphs,
  PartialTableOptions,
  TableOptions,
  VerticalBorder,
  VerticalGlyphs,
  StyleObj,
  CustomStylesTarget,
  AnyBorder,
  RowType,
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./inputValidations";
import { deepMerge, nullUndefinedOrFalse } from "./utils";
import { Cell } from "./Cell";
import { StyleHelper } from "./StyleHelper";
import { Row } from "./Row";
import { RowFactory } from "./RowFactory";
import { VersitableFacade } from "./VersitableFacade";

// Main class which does all the work
export class Versitable {
  _rows: Row[];
  _options: TableOptions;
  _colWidths: number[];

  private constructor(
    inputTable: string[][],
    inputOptions?: PartialTableOptions
  ) {
    this.validateTable(inputTable);
    this.validateOptions(inputOptions);

    this._options = deepMerge(TABLE_DEFAULTS, inputOptions || {});
    this.populateBordersOptWithDefaults();
    this.populateStylesOptWithDefaults();
    const limitInputRowsTable = this.limitInputRows(inputTable);
    const limitInputColsTable = this.limitInputCols(limitInputRowsTable);
    this._rows = this.createRowsFromStrings(limitInputColsTable);
    this._colWidths = this.calcColWidths();
    this.splitTooLongCellsAndInsertOverflow();
    this.padCells();
    this.addBorders();
    // this.addColors();
  }

  // This is how users will create a new table
  // It returns a VersitableFacade, which is the public interface
  static make(inputStrings: string[][], inputOptions?: PartialTableOptions) {
    const newVersitable = new Versitable(inputStrings, inputOptions);
    const stringTable = Versitable.stringifyTable(newVersitable);
    return new VersitableFacade(stringTable);
  }

  static stringifyTable(versitable: Versitable): string[][] {
    return versitable._rows.map((row) => row.cells.map((cell) => cell.content));
  }

  get rowCount(): number {
    return this._rows.length;
  }

  get colCount(): number {
    return this._rows[0].length;
  }

  get rowTypes(): RowType[] {
    return this._rows.map((row) => row.type);
  }

  get borders(): CustomBorders {
    return this._options.borders as CustomBorders;
  }

  get styles(): CustomStyles {
    return this._options.styles as CustomStyles;
  }

  getColByIdx(colIdx: number): Cell[] {
    return this._rows.map((row) => row.cells[colIdx]);
  }

  getCellByCoords(rowIdx: number, colIdx: number): Cell {
    return this._rows[rowIdx].cellAtIdx(colIdx);
  }

  isAnyBorder(type: CellType) {
    if (type !== "primary" && type !== "overflow") return true;
    return false;
  }

  isOuterBorder(type: CellType) {
    if (this.isAnyBorder(type) && !this.isInnerBorder(type)) return true;
    return false;
  }

  isInnerBorder(type: CellType) {
    if (type === "betweenColumns" || type === "betweenRows") return true;
    return false;
  }

  borderExists(type: AnyBorder) {
    return !nullUndefinedOrFalse(this.borders.sides[type]);
  }

  populateArrFromMaxColWidths(): number[] {
    const colCount = this.colCount;
    const userMaxColWidths = this._options.maxColWidths;
    // format options.maxColWidths
    if (typeof userMaxColWidths === "number") {
      return Array(colCount).fill(userMaxColWidths);
    } else if (userMaxColWidths.length < colCount) {
      // This extends the options.maxColWidths array to match the number of columns in the table
      const defaultWidthsArr = Array(colCount - userMaxColWidths.length).fill(
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

  populateStylesOptWithDefaults(): void {
    if (typeof this._options.styles === "boolean") {
      if (this._options.styles === true) {
        this._options.styles = TABLE_DEFAULTS.styles as CustomStyles;
      } else return;
    } else {
      this._options.styles = deepMerge(
        TABLE_DEFAULTS.styles,
        this._options.styles
      ) as CustomStyles;
    }
  }

  // addColors() {
  //   if (nullUndefinedOrFalse(this.colors)) return;

  //   const { targetCells, alternateRows, borderColor } = this.colors;

  //   if (alternateRows) {
  //     // Iterate over rows, cycling through alternateRows colors
  //     const alternating = alternateRows.length > 1;
  //     let alternateRowIdx = 0;
  //     this._rows.forEach((row, rowIdx) => {
  //       const rowType = this.getRowType(rowIdx);
  //       let savedRowColor: PartialCellStyle | undefined = undefined;
  //       let avgRowColor: string | undefined = undefined;

  //       row.forEach((cell, colIdx) => {
  //         const cellNeedsColor = this.checkCellNeedsColor(
  //           "alternateRows",
  //           cell,
  //           colIdx,
  //           rowIdx
  //         );
  //         if (!cellNeedsColor) return;
  //         let cellColor: PartialCellStyle;
  //         // Save color from previous cell if it exists
  //         if (savedRowColor) {
  //           cellColor = savedRowColor;
  //         } else {
  //           // Cycle through alternateRows colors
  //           cellColor = alternateRows[alternateRowIdx % alternateRows.length];
  //         }

  //         // If cell is a betweenRow border cell, calculate avg bg color from adjacent rows
  //         if (this.needToGetAvgColor(avgRowColor, rowType, alternateRowIdx)) {
  //           // Cell is a betweenRows border
  //           const aboveCellBgColor = cellColor.bgColor;
  //           const nextRowColor =
  //             alternateRows[(alternateRowIdx + 1) % alternateRows.length];
  //           const belowCellBgColor = nextRowColor.bgColor;
  //           avgRowColor = ColorHelper.calcAvgColor(
  //             aboveCellBgColor!,
  //             belowCellBgColor!
  //           );

  //           if (borderColor.bgColor) {
  //             avgRowColor = ColorHelper.calcAvgColor(
  //               avgRowColor!,
  //               borderColor.bgColor!
  //             );
  //           }
  //         }
  //         if (this.isInnerBorder(cell.type)) {
  //           if (borderColor) {
  //             cellColor = {
  //               ...borderColor,
  //             } as PartialCellStyle;
  //           }
  //           // Add different bgColor based on if cell is betweenRows or betweenCols
  //           cellColor.bgColor =
  //             cell.type === "betweenRows"
  //               ? avgRowColor
  //               : savedRowColor!.bgColor;
  //         }

  //         // Color is determined, so apply it to the cell and save it for the next cells
  //         savedRowColor ??= cellColor;
  //         const styledString = this.createStyledCell(cell.content, cellColor);
  //         cell.content = styledString;
  //       });

  //       const topRowExists = this.borderExists("top");
  //       if (
  //         alternating &&
  //         rowIdx < this._rows.length - 1 &&
  //         this.getRowType(rowIdx + 1) === "primary"
  //       ) {
  //         if ((topRowExists && rowIdx > 1) || (!topRowExists && rowIdx > 0)) {
  //           alternateRowIdx++;
  //         }
  //       }
  //     });
  //   }

  //   if (borderColor) {
  //     this._rows.forEach((row) => {
  //       row.forEach((cell) => {
  //         if (this.isOuterBorder(cell.type)) {
  //           // If border bgColor is not set, use savedAvgBGTableColor
  //           const color = { ...borderColor };
  //           const styledString = this.createStyledCell(cell.content, color);
  //           cell.content = styledString;
  //         }
  //       });
  //     });
  //   }
  // }

  // needToGetAvgColor(
  //   avgRowColor: string | undefined,
  //   rowType: CellType,
  //   alternateRowIdx: number
  // ) {
  //   if (avgRowColor !== undefined) return false;
  //   const { alternateRows } = this.colors;
  //   const currColor = alternateRows[alternateRowIdx % alternateRows.length];
  //   const nextColor =
  //     alternateRows[(alternateRowIdx + 1) % alternateRows.length];
  //   if (rowType === "betweenRows" && currColor.bgColor && nextColor.bgColor) {
  //     return true;
  //   }
  //   return false;
  // }

  // checkCellNeedsStyle(
  //   target: CustomStylesTarget,
  //   cell: Cell,
  //   colIdx: number,
  //   rowIdx: number
  // ) {
  //   if (target === "rowStyles") {
  //     if (!this.isOuterBorder(cell.type)) {
  //       if (
  //         (this.borderExists("left") && colIdx === 0) ||
  //         (this.borderExists("right") && colIdx === this._rows[0].length - 1)
  //       ) {
  //         return false;
  //       }
  //       return true;
  //     }
  //   }
  // }

  // createStyledCell(cellString: string, styleObj: StyleObj): string {
  //   // StyleHelper.validateColor(styleObj.color); // TODO
  //   const { fgColor, bgColor, modifier } = styleObj;
  //   return StyleHelper.createStyledString(
  //     cellString,
  //     fgColor,
  //     bgColor,
  //     modifier
  //   );
  // }

  // Mutations to table

  // Calculations for table properties
  calcColWidths(): number[] {
    const maxColWidthsArr = this.populateArrFromMaxColWidths();
    const longestStrLenPerCol = this.findLongestStrLenPerCol();

    return longestStrLenPerCol.map((longestStrLen, colIdx) => {
      return Math.min(maxColWidthsArr[colIdx], longestStrLen);
    });
  }

  findLongestStrLenPerCol(): number[] {
    let longestStrings: number[] = [];
    for (let i = 0; i < this.colCount; i++) {
      const longestInCol = this.getColByIdx(i).reduce((acc, cell) => {
        if (cell.length > acc) acc = cell.length;
        return acc;
      }, 0);
      longestStrings.push(longestInCol);
    }
    return longestStrings;
  }

  // Helper functions
  createRowsFromStrings(tableContentStrings: string[][]): Row[] {
    return tableContentStrings.map((rowContentStrings) =>
      RowFactory.createRowFromStrings(rowContentStrings)
    );
  }

  limitInputRows(inputTable: string[][]): string[][] {
    if (inputTable.length > this._options.maxRows) {
      return inputTable.slice(0, this._options.maxRows);
    } else return inputTable;
  }

  limitInputCols(inputTable: string[][]): string[][] {
    const actualMaxColumns = Math.min(
      this._options.maxColumns,
      inputTable[0].length
    );
    return inputTable.map((row) => row.slice(0, actualMaxColumns));
  }

  splitTooLongCellsAndInsertOverflow(): void {
    const maxRowHeight = this._options.maxRowHeight;
    const originalRowCount = this.rowCount;
    const originalRowLength = this._rows[0].length;
    let totalInsertRows = 0; // used to adjust rowIdx for inserted rows

    for (let i = 0; i < originalRowCount; i++) {
      let insertRows: Row[] = [];
      const rowIdxWithInserts = i + totalInsertRows;

      for (let colIdx = 0; colIdx < originalRowLength; colIdx++) {
        const maxColWidth = this._colWidths[colIdx];
        const cell = this._rows[rowIdxWithInserts].cellAtIdx(colIdx);

        // Cell isn't too long to fit in column, skip over it
        if (cell.length <= maxColWidth) continue;
        // Row height is one, so just split cell in place and continue
        if (maxRowHeight === 1) {
          cell.splitAt(maxColWidth);
          continue;
        }
        // Row height is greater than one, so split cell and insert overflow into new rows
        let sliceNum = 0;
        let lastSlice: Cell | undefined;
        while (sliceNum < maxRowHeight - 1) {
          const targetCell = lastSlice || cell;
          // If last slice reached end of cell, break out of loop
          if (targetCell.content[sliceNum * maxColWidth] === undefined) break;
          // Create new insert row if needed
          if (insertRows[sliceNum] === undefined) {
            insertRows.push(this.createBlankRow("overflow"));
            totalInsertRows++;
          }
          const insertCell = targetCell.splitAt(maxColWidth);
          const isLastInsertRow = sliceNum === maxRowHeight - 2;
          if (insertCell.length > maxColWidth && isLastInsertRow) {
            insertCell.splitAt(maxColWidth);
          }
          // Add new cell to insert row
          insertRows[sliceNum].insertCellAtIdx(colIdx, insertCell);
          lastSlice = insertCell;
          sliceNum++;
        }
      }
      // Add insert rows to table
      if (insertRows.length > 0) {
        this._rows.splice(rowIdxWithInserts + 1, 0, ...insertRows);
        insertRows = [];
      }
    }
  }

  createBlankRow(type: CellType): Row {
    return RowFactory.createBlankRowOfLength(this.colCount, type);
  }

  padCells(): void {
    for (let rowIdx = 0; rowIdx < this.rowCount; rowIdx++) {
      for (let colIdx = 0; colIdx < this.colCount; colIdx++) {
        const cell = this.getCellByCoords(rowIdx, colIdx);
        const maxColWidth = this._colWidths[colIdx];
        const cellPadding =
          maxColWidth - cell.length + this._options.cellPadding;
        if (cellPadding > 0) {
          cell.pad(cellPadding, "right");
        }
      }
    }
    // Update colWidths property with new widths
    this._colWidths.forEach((width, idx, arr) => {
      arr[idx] = width + this._options.cellPadding;
    });
  }

  findHorizontalBorderInsertIdxs(type: HorizontalBorder) {
    let insertIdxs: number[] = [];
    switch (type) {
      case "betweenRows":
        insertIdxs = this.rowTypes.reduce((acc, type, idx) => {
          if (type === "primary") acc.push(idx);
          return acc;
        }, [] as number[]);
        break;
      case "top":
        insertIdxs.push(0);
        break;
      case "bottom":
        insertIdxs.push(this._rows.length);
        break;
      default:
        throw new Error("Invalid horizontal border type");
    }
    return insertIdxs;
  }

  insertHorizontalBorder(type: HorizontalBorder) {
    const insertIdxs = this.findHorizontalBorderInsertIdxs(type);

    for (let i = insertIdxs.length - 1; i >= 0; i--) {
      const { horizontalLine } = this.getGlyphsForBorderType(type);
      const border = RowFactory.createHorizontalBorder(
        type,
        this._colWidths,
        horizontalLine
      );
      this._rows.splice(insertIdxs[i], 0, border);
    }
  }

  insertVerticalBorder(type: VerticalBorder) {
    const borderGlyphs = this.getGlyphsForBorderType(type);

    for (let i = 0; i < this.rowCount; i++) {
      const row = this._rows[i];
      const rowWithBorder = RowFactory.createRowWithVerticalBorders(
        type,
        row,
        borderGlyphs
      );
      this._rows[i] = rowWithBorder;
    }
  }

  addBorders(): void {
    if (this._options.borders === false) return;
    const sides = this.borders.sides;

    // Insert horizontal borders
    if (sides.betweenRows) this.insertHorizontalBorder("betweenRows");
    if (sides.top) this.insertHorizontalBorder("top");
    if (sides.bottom) this.insertHorizontalBorder("bottom");
    // Insert vertical borders
    if (sides.betweenColumns) this.insertVerticalBorder("betweenColumns");
    if (sides.right) this.insertVerticalBorder("right");
    if (sides.left) this.insertVerticalBorder("left");
  }

  getGlyphsForBorderType(type: HorizontalBorder): HorizontalGlyphs;
  getGlyphsForBorderType(type: VerticalBorder): VerticalGlyphs;
  getGlyphsForBorderType(
    type: HorizontalBorder | VerticalBorder
  ): HorizontalGlyphs | VerticalGlyphs {
    const { glyphs } = this._options.borders as CustomBorders;

    switch (type) {
      case "left":
        return {
          topEdge: glyphs.topLeftCorner,
          bottomEdge: glyphs.bottomLeftCorner,
          separator: glyphs.leftSeparator,
          verticalLine: glyphs.verticalLine,
        };
      case "right":
        return {
          topEdge: glyphs.topRightCorner,
          bottomEdge: glyphs.bottomRightCorner,
          separator: glyphs.rightSeparator,
          verticalLine: glyphs.verticalLine,
        };
      case "betweenColumns":
        return {
          topEdge: glyphs.topSeparator,
          bottomEdge: glyphs.bottomSeparator,
          separator: glyphs.middleSeparator,
          verticalLine: glyphs.verticalLine,
        };
      case "top":
      case "bottom":
      case "betweenRows":
        return {
          horizontalLine: glyphs.horizontalLine,
        };
      default:
        throw new Error("Invalid border type");
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