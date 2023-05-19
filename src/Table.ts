import { TABLE_DEFAULTS } from "./tableDefaults";
import {
  CellType,
  CustomBorders,
  CustomColors,
  HorizontalBorder,
  HorizontalGlyphs,
  PartialTableOptions,
  TableOptions,
  VersitableType,
  VerticalBorder,
  VerticalGlyphs,
  CellStyle,
  CustomColorsTarget,
  PartialCellStyle,
  AnyBorder,
  IRow,
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations";
import { deepMerge, nullUndefinedOrFalse } from "./utils";
import { Cell } from "./Cell";
import { ColorHelper } from "./ColorHelper";
import { Row } from "./Row";

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
    this.populateColorsOptWithDefaults();
    const limitInputRowsTable = this.limitInputRows(inputTable);
    const limitInputColsTable = this.limitInputCols(limitInputRowsTable);
    this._rows = this.createRowsFromStrings(limitInputColsTable);
    this._colWidths = this.calcColWidths();
    this.splitCellsBetweenRows();
    this.padCells();
    this.addBorders();
    this.addColors();
  }

  get numRows(): number {
    return this._rows.length;
  }

  get numCols(): number {
    return this._rows[0].length;
  }

  get rowByIdx(): (rowIdx: number) => Row {
    return (rowIdx: number) => this._rows[rowIdx];
  }

  get colByIdx(): (colIdx: number) => Cell[] {
    return (colIdx: number) => this._rows.map((row) => row.cells[colIdx]);
  }

  get borders(): CustomBorders {
    return this._options.borders as CustomBorders;
  }

  get colors(): CustomColors {
    return this._options.colors as CustomColors;
  }

  addColors() {
    if (nullUndefinedOrFalse(this.colors)) return;

    const { targetCells, alternateRows, borderColor } = this.colors;

    if (alternateRows) {
      // Iterate over rows, cycling through alternateRows colors
      const alternating = alternateRows.length > 1;
      let alternateRowIdx = 0;
      this._rows.forEach((row, rowIdx) => {
        const rowType = this.getRowType(rowIdx);
        let savedRowColor: PartialCellStyle | undefined = undefined;
        let avgRowColor: string | undefined = undefined;

        row.forEach((cell, colIdx) => {
          const cellNeedsColor = this.checkCellNeedsColor(
            "alternateRows",
            cell,
            colIdx,
            rowIdx
          );
          if (!cellNeedsColor) return;
          let cellColor: PartialCellStyle;
          // Save color from previous cell if it exists
          if (savedRowColor) {
            cellColor = savedRowColor;
          } else {
            // Cycle through alternateRows colors
            cellColor = alternateRows[alternateRowIdx % alternateRows.length];
          }

          // If cell is a betweenRow border cell, calculate avg bg color from adjacent rows
          if (this.needToGetAvgColor(avgRowColor, rowType, alternateRowIdx)) {
            // Cell is a betweenRows border
            const aboveCellBgColor = cellColor.bgColor;
            const nextRowColor =
              alternateRows[(alternateRowIdx + 1) % alternateRows.length];
            const belowCellBgColor = nextRowColor.bgColor;
            avgRowColor = ColorHelper.calcAvgColor(
              aboveCellBgColor!,
              belowCellBgColor!
            );

            if (borderColor.bgColor) {
              avgRowColor = ColorHelper.calcAvgColor(
                avgRowColor!,
                borderColor.bgColor!
              );
            }
          }
          if (this.isInnerBorder(cell.type)) {
            if (borderColor) {
              cellColor = {
                ...borderColor,
              } as PartialCellStyle;
            }
            // Add different bgColor based on if cell is betweenRows or betweenCols
            cellColor.bgColor =
              cell.type === "betweenRows"
                ? avgRowColor
                : savedRowColor!.bgColor;
          }

          // Color is determined, so apply it to the cell and save it for the next cells
          savedRowColor ??= cellColor;
          const styledString = this.createStyledCell(cell.content, cellColor);
          cell.content = styledString;
        });

        const topRowExists = this.borderExists("top");
        if (
          alternating &&
          rowIdx < this._rows.length - 1 &&
          this.getRowType(rowIdx + 1) === "primary"
        ) {
          if ((topRowExists && rowIdx > 1) || (!topRowExists && rowIdx > 0)) {
            alternateRowIdx++;
          }
        }
      });
    }

    if (borderColor) {
      this._rows.forEach((row) => {
        row.forEach((cell) => {
          if (this.isOuterBorder(cell.type)) {
            // If border bgColor is not set, use savedAvgBGTableColor
            const color = { ...borderColor };
            const styledString = this.createStyledCell(cell.content, color);
            cell.content = styledString;
          }
        });
      });
    }
  }

  needToGetAvgColor(
    avgRowColor: string | undefined,
    rowType: CellType,
    alternateRowIdx: number
  ) {
    if (avgRowColor !== undefined) return false;
    const { alternateRows } = this.colors;
    const currColor = alternateRows[alternateRowIdx % alternateRows.length];
    const nextColor =
      alternateRows[(alternateRowIdx + 1) % alternateRows.length];
    if (rowType === "betweenRows" && currColor.bgColor && nextColor.bgColor) {
      return true;
    }
    return false;
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

  getRowType(rowIdx: number): CellType {
    const definingCell = this.borderExists("left")
      ? this._rows[rowIdx][1]
      : this._rows[rowIdx][0];
    return definingCell.type;
  }

  checkCellNeedsColor(
    target: CustomColorsTarget,
    cell: Cell,
    colIdx: number,
    rowIdx: number
  ) {
    if (target === "alternateRows") {
      if (!this.isOuterBorder(cell.type)) {
        if (
          (this.borderExists("left") && colIdx === 0) ||
          (this.borderExists("right") && colIdx === this._rows[0].length - 1)
        ) {
          return false;
        }
        return true;
      }
    }
  }

  createStyledCell(cellString: string, cellStyle: CellStyle): string {
    // ColorHelper.validateColor(cellStyle.color); // TODO
    const { fgColor, bgColor, style } = cellStyle;
    return ColorHelper.createStyledString(cellString, fgColor, bgColor, style);
  }

  // User-facing methods
  // Make a new table with Versitable.make(inputTable, inputOptions)
  static make(inputTable: string[][], inputOptions?: PartialTableOptions) {
    const newCellTable = new Versitable(inputTable, inputOptions);
    const newStringTable = Versitable.cellsToStrings(newCellTable._table);
    return new VersitableArray(newStringTable);
  }

  // Mutations to table
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

  splitCellsBetweenRows(): void {
    const maxRowHeight = this._options.maxRowHeight;
    const originalRowCount = this._rows.length;
    const originalRowLength = this._rows[0].length;
    let totalInsertRows = 0; // used to adjust rowIdx for inserted rows

    for (let i = 0; i < originalRowCount; i++) {
      let insertRows: Cell[][] = [];
      const rowIdxWithInserts = i + totalInsertRows;

      for (let colIdx = 0; colIdx < originalRowLength; colIdx++) {
        const maxColWidth = this._colWidths[colIdx];
        const cell = this._rows[rowIdxWithInserts][colIdx];

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
            insertRows.push(this.createNewInsertRow("overflow"));
            totalInsertRows++;
          }
          const insertCell = targetCell.splitAt(maxColWidth);
          const isLastInsertRow = sliceNum === maxRowHeight - 2;
          if (insertCell.length > maxColWidth && isLastInsertRow) {
            insertCell.splitAt(maxColWidth);
          }
          // Add new cell to insert row
          insertRows[sliceNum][colIdx] = insertCell;
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

  createNewInsertRow(type: CellType): CellType[] {
    return this._colWidths.map((colWidth) => {
      const newCell = new Cell(type, " ".repeat(colWidth), colWidth);
      return newCell;
    });
  }

  padCells(): void {
    this._rows.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const maxColWidth = this._colWidths[colIdx];
        const cellPadding =
          maxColWidth - cell.length + this._options.cellPadding;
        if (cellPadding > 0) {
          cell.pad(cellPadding, "left");
        }
      });
    });
    // Add padding to colWidths lengths
    this._colWidths.forEach((width, idx, arr) => {
      arr[idx] = width + this._options.cellPadding;
    });
  }

  findHorizontalBorderInsertIdxs(type: HorizontalBorder) {
    let insertIdxs: number[] = [];
    switch (type) {
      case "betweenRows":
        insertIdxs = this._rows.reduce((acc, row, idx) => {
          if (idx > 0 && this.getRowType(idx) === "primary") acc.push(idx);
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
      const border = this.createHorizontalBorder(type);
      this._rows.splice(insertIdxs[i], 0, border);
    }
  }

  insertVerticalBorder(type: VerticalBorder) {
    for (let i = 0; i < this._rows.length; i++) {
      const row = this._rows[i];
      const rowWithBorder = this.createVerticalBorder(row, type);
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

  // Calculations for table properties
  calcColWidths(): number[] {
    const maxColWidthsArr = this.populateArrFromMaxColWidths();
    const longestStrLenPerCol = this.findLongestStrLenPerCol();

    return longestStrLenPerCol.map((longestStrLen, colIdx) => {
      return Math.min(maxColWidthsArr[colIdx], longestStrLen);
    });
  }

  // Helper functions
  createRowsFromStrings(tableContentStrings: string[][]): Row[] {
    return tableContentStrings.map((rowContentStrings) =>
      Row.createRowFromStrings(rowContentStrings)
    );
  }

  static cellsToStrings(cellTable: CellType[][]): string[][] {
    return cellTable.map((row) => row.map((cell) => cell.content));
  }

  populateArrFromMaxColWidths(): number[] {
    const numCols = this.numCols;
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

  populateColorsOptWithDefaults(): void {
    if (typeof this._options.colors === "boolean") {
      if (this._options.colors === true) {
        this._options.colors = TABLE_DEFAULTS.colors as CustomColors;
      } else return;
    } else {
      this._options.colors = deepMerge(
        TABLE_DEFAULTS.colors,
        this._options.colors
      ) as CustomColors;
    }
  }

  findLongestStrLenPerCol(): number[] {
    let longestStrings: number[] = [];
    for (let i = 0; i < this._rows.length; i += 1) {
      const longestInCol = this.colByIdx(i).reduce((acc, cell) => {
        if (cell.length > acc) acc = cell.length;
        return acc;
      }, 0);
      longestStrings.push(longestInCol);
    }
    return longestStrings;
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

  createHorizontalBorder(type: HorizontalBorder): CellType[] {
    const { horizontalLine } = this.getGlyphsForBorderType(type);

    return this._colWidths.map((colWidth) => {
      return new Cell(type, horizontalLine.repeat(colWidth), colWidth);
    });
  }

  appendVertBorderToCell(
    borderType: AnyBorder,
    borderStr: string,
    cell: CellType
  ): CellType[] {
    const borderCell = new Cell(borderType, borderStr, 1);
    return [cell, borderCell];
  }

  addVertBorderToCells(
    borderType: AnyBorder,
    borderStr: string,
    cells: CellType[]
  ): CellType[] {
    const borderCell = new Cell(borderType, borderStr, 1);
    return borderType !== "right"
      ? [borderCell, ...cells]
      : [...cells, borderCell];
  }

  createVerticalBorder(row: CellType[], type: VerticalBorder): CellType[] {
    const { verticalLine, topEdge, bottomEdge, separator } =
      this.getGlyphsForBorderType(type);

    if (type === "left" || type === "right") {
      const rowType = row[0].type;
      let borderGlyph;

      switch (rowType) {
        case "top":
          borderGlyph = topEdge;
          break;
        case "bottom":
          borderGlyph = bottomEdge;
          break;
        case "betweenRows":
          borderGlyph = separator;
          break;
        default:
          borderGlyph = verticalLine;
          break;
      }

      return this.addVertBorderToCells(type, borderGlyph, row);
    } else {
      // border === "betweenColumns"
      let newRow: CellType[] = row.reduce((acc: CellType[], cell, colIdx) => {
        const isLastCol = colIdx === row.length - 1;
        if (isLastCol) {
          acc.push(cell);
        } else if (cell.type === "top" || cell.type === "bottom") {
          const borderGlyph = cell.type === "top" ? topEdge : bottomEdge;
          acc.push(
            ...this.appendVertBorderToCell(cell.type, borderGlyph, cell)
          );
        } else {
          const isBetweenRows = cell.type === "betweenRows";
          const borderGlyph = isBetweenRows ? separator : verticalLine;
          const cellType = isBetweenRows ? "betweenRows" : "betweenColumns";
          acc.push(...this.appendVertBorderToCell(cellType, borderGlyph, cell));
        }
        return acc;
      }, []);
      return newRow;
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
