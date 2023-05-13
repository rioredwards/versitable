import { countCharsWithEmojis } from "./emojis";
import { TABLE_DEFAULTS } from "./tableDefaults";
import {
  CellType,
  CellTypes,
  CustomBorders,
  CustomColors,
  HorizontalBorderType,
  HorizontalGlyphs,
  PartialTableOptions,
  TableOptions,
  VersitableType,
  VerticalBorderType,
  VerticalGlyphs,
  CellStyle,
  CustomColorsTarget,
  cellTypesArr,
  AllBordersType,
  PartialCellStyle,
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations";
import { deepMerge } from "./utils";
import { Cell } from "./Cell";
import { chalkFgColors } from "./tableTypes";
import { ColorHelper } from "./ColorHelper";

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
  _table: CellType[][];
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
    this._table = this.stringsToCells(limitInputColsTable);
    this._colWidths = this.calcColWidths();
    this.splitCells();
    this.padCells();
    this.addBorders();
    this.addColors();
  }

  addColors() {
    if (!this._options.colors) return;

    const { targetCells, alternateRows, borderColor } = this._options
      .colors as CustomColors;
    let savedAvgBGColor: any;

    if (alternateRows) {
      // Iterate over rows, cycling through alternateRows colors
      const alternating = alternateRows.length > 1;
      let alternateRowIdx = 0;
      this._table.forEach((row, rowIdx) => {
        const rowType = this.getRowType(rowIdx);

        row.forEach((cell, colIdx) => {
          const cellNeedsColor = this.checkCellNeedsColor(
            "alternateRows",
            cell,
            colIdx,
            rowIdx
          );
          if (!cellNeedsColor) return;
          // Cycle through alternateRows colors
          let color = alternateRows[alternateRowIdx % alternateRows.length];

          // If cell is a betweenRow border cell, calculate avg bg color from adjacent rows
          if (this.needToGetAvgColor(color, rowType, alternateRowIdx)) {
            // Cell is a betweenRows border
            const aboveCellBgColor = color.bgColor;
            const nextRowColor =
              alternateRows[(alternateRowIdx + 1) % alternateRows.length];
            const belowCellBgColor = nextRowColor.bgColor;
            const avgColor = ColorHelper.calcAvgColor(
              aboveCellBgColor!,
              belowCellBgColor!
            );
            // Add avgColor as bgColor for this cell
            color = { ...borderColor, bgColor: avgColor };
            // Conditionally save avgColor for use in outer border cells
            if (!borderColor.bgColor) savedAvgBGColor ??= avgColor;
          } else if (cell.type === "betweenColumns") {
            // Cell is a betweenColumns border
            const bgColor = color.bgColor;
            if (borderColor) {
              color = { ...borderColor, bgColor: bgColor } as PartialCellStyle;
            }
          } else {
            // Cell is overflow or primary, so use color as-is
          }

          // Color is determined, so apply it to the cell
          const styledString = this.createStyledCell(cell.content, color);
          cell.content = styledString;
        });

        const topRowExists =
          (this._options.borders as CustomBorders).sides.top !== undefined;

        if (
          alternating &&
          rowIdx < this._table.length - 1 &&
          this.getRowType(rowIdx + 1) === "primary"
        ) {
          if ((topRowExists && rowIdx > 1) || (!topRowExists && rowIdx > 0)) {
            alternateRowIdx++;
          }
        }
      });
    }
    if (borderColor) {
      this._table.forEach((row) => {
        row.forEach((cell) => {
          if (this.isOuterBorder(cell.type)) {
            // If border bgColor is not set, use savedAvgBGColor
            const bgColor =
              savedAvgBGColor ??
              (this._options.colors as CustomColors).borderColor.bgColor;
            const color = { ...borderColor, bgColor };
            const styledString = this.createStyledCell(cell.content, color);
            cell.content = styledString;
          }
        });
      });
    }
  }

  needToGetAvgColor(
    color: PartialCellStyle,
    rowType: CellTypes,
    alternateRowIdx: number
  ) {
    const { alternateRows } = this._options.colors as CustomColors;
    const nextColor =
      alternateRows[(alternateRowIdx + 1) % alternateRows.length];
    if (rowType === "betweenRows" && color.bgColor && nextColor.bgColor) {
      return true;
    }
    return false;
  }

  isAnyBorder(type: CellTypes) {
    if (type !== "primary" && type !== "overflow") return true;
    return false;
  }

  isOuterBorder(type: CellTypes) {
    if (this.isAnyBorder(type) && !this.isInnerBorder(type)) return true;
    return false;
  }

  isInnerBorder(type: CellTypes) {
    if (type === "betweenColumns" || type === "betweenRows") return true;
    return false;
  }

  getRowType(rowIdx: number): CellTypes {
    const leftBorderExists =
      (this._options.borders as CustomBorders).sides.left !== undefined;
    const definingCell = leftBorderExists
      ? this._table[rowIdx][1]
      : this._table[rowIdx][0];
    return definingCell.type;
  }

  checkCellNeedsColor(
    target: CustomColorsTarget,
    cell: Cell,
    colIdx: number,
    rowIdx: number
  ) {
    const leftBorderExists =
      (this._options.borders as CustomBorders).sides.left !== undefined;
    const rightBorderExists =
      (this._options.borders as CustomBorders).sides.right !== undefined;
    if (target === "alternateRows") {
      if (!this.isOuterBorder(cell.type)) {
        if (
          (leftBorderExists && colIdx === 0) ||
          (rightBorderExists && colIdx === this._table[0].length - 1)
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

  splitCells(): void {
    let newTable: CellType[][] = [];

    this._table.forEach((row) => {
      let insertRows: CellType[][] = [this.createNewInsertRow("primary")];

      row.forEach((cell, colIdx) => {
        const maxColWidth = this._colWidths[colIdx];

        if (cell.length <= maxColWidth) {
          // Cell is not too long, so just add it
          insertRows[0][colIdx] = cell;
        } else {
          // cell is too long, truncate cell and conditionally insert remainder into next row
          let sliceIdx = 0; // used with maxColWidth to calculate idx to slice string & used as rowIdx of slice in insertRows
          while (sliceIdx < this._options.maxRowHeight) {
            if (cell.content[sliceIdx * maxColWidth] === undefined) break; // Reached end of cell on last slice
            // Check if new insertRow is needed
            if (insertRows[sliceIdx] === undefined) {
              insertRows.push(this.createNewInsertRow("overflow"));
            }

            const sliceStartIdx = sliceIdx * maxColWidth;
            const sliceEndIdx = maxColWidth + sliceIdx * maxColWidth;
            const sliceContent = cell.content.substring(
              sliceStartIdx,
              sliceEndIdx
            );
            const sliceLength = countCharsWithEmojis(sliceContent);
            const type = sliceIdx === 0 ? "primary" : "overflow";
            const insertCell = new Cell(type, sliceContent, sliceLength);
            // Update insertRows and cellLengths arrays with new cell
            insertRows[sliceIdx][colIdx] = insertCell;
            sliceIdx++;
          }
        }
      });
      newTable.push(...insertRows);
    });
    this._table = newTable;
  }

  createNewInsertRow(type: CellTypes): CellType[] {
    return this._colWidths.map((colWidth) => {
      const newCell = new Cell(type, " ".repeat(colWidth), colWidth);
      return newCell;
    });
  }

  padCells(): void {
    this._table.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const maxColWidth = this._colWidths[colIdx];
        const cellPadding =
          maxColWidth - cell.length + this._options.cellPadding;
        if (cellPadding > 0) {
          const padding = " ".repeat(cellPadding);
          const newCell = new Cell(
            cell.type,
            cell.content + padding,
            cell.length + cellPadding
          );
          this._table[rowIdx][colIdx] = newCell;
        }
      });
    });
    // Add padding to colWidths lengths
    this._colWidths.forEach((width, idx, arr) => {
      arr[idx] = width + this._options.cellPadding;
    });
  }

  findHorizontalBorderInsertIdxs(type: HorizontalBorderType) {
    let insertIdxs: number[] = [];
    switch (type) {
      case "betweenRows":
        insertIdxs = this._table.reduce((acc, row, idx) => {
          if (idx > 0 && this.getRowType(idx) === "primary") acc.push(idx);
          return acc;
        }, [] as number[]);
        break;
      case "top":
        insertIdxs.push(0);
        break;
      case "bottom":
        insertIdxs.push(this._table.length);
        break;
      default:
        throw new Error("Invalid horizontal border type");
    }
    return insertIdxs;
  }

  insertHorizontalBorder(type: HorizontalBorderType) {
    const insertIdxs = this.findHorizontalBorderInsertIdxs(type);

    for (let i = insertIdxs.length - 1; i >= 0; i--) {
      const border = this.createHorizontalBorder(type);
      this._table.splice(insertIdxs[i], 0, border);
    }
  }

  insertVerticalBorder(type: VerticalBorderType) {
    for (let i = 0; i < this._table.length; i++) {
      const row = this._table[i];
      const rowWithBorder = this.createVerticalBorder(row, type);
      this._table[i] = rowWithBorder;
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
    if (sides.betweenColumns) this.insertVerticalBorder("betweenColumns");
    if (sides.right) this.insertVerticalBorder("right");
    if (sides.left) this.insertVerticalBorder("left");
  }

  // Calculations for table properties
  calcColWidths(): number[] {
    const maxColWidthsArr = this.populateArrFromMaxColWidths();
    const maxCharsPerColumn = this.findLongestStrLenInCol();

    return this._table[0].map((_, colIdx) => {
      return Math.min(maxColWidthsArr[colIdx], maxCharsPerColumn[colIdx]);
    });
  }

  // Helper functions
  stringsToCells(table: string[][]): CellType[][] {
    return table.map((row) =>
      row.map((cell) => {
        return new Cell("primary", cell, countCharsWithEmojis(cell));
      })
    );
  }

  static cellsToStrings(cellTable: CellType[][]): string[][] {
    return cellTable.map((row) => row.map((cell) => cell.content));
  }

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

  findLongestStrLenInCol(): number[] {
    return this._table[0].map((_, colIdx) => {
      let max = 0;
      for (let i = 0; i < this._table.length; i += 1) {
        const cellLength = this._table[i][colIdx].length;
        if (cellLength > max) max = cellLength;
      }
      return max;
    });
  }

  getGlyphsForBorderType(type: HorizontalBorderType): HorizontalGlyphs;
  getGlyphsForBorderType(type: VerticalBorderType): VerticalGlyphs;
  getGlyphsForBorderType(
    type: HorizontalBorderType | VerticalBorderType
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

  createHorizontalBorder(type: HorizontalBorderType): CellType[] {
    const { horizontalLine } = this.getGlyphsForBorderType(type);

    return this._colWidths.map((colWidth) => {
      return new Cell(type, horizontalLine.repeat(colWidth), colWidth);
    });
  }

  appendVertBorderToCell(
    borderType: AllBordersType,
    borderStr: string,
    cell: CellType
  ): CellType[] {
    const borderCell = new Cell(borderType, borderStr, 1);
    return [cell, borderCell];
  }

  addVertBorderToCells(
    borderType: AllBordersType,
    borderStr: string,
    cells: CellType[]
  ): CellType[] {
    const borderCell = new Cell(borderType, borderStr, 1);
    return borderType !== "right"
      ? [borderCell, ...cells]
      : [...cells, borderCell];
  }

  createVerticalBorder(row: CellType[], type: VerticalBorderType): CellType[] {
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
