import chalk = require("chalk");
import { Chalk } from "chalk";
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
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./tableValidations";
import { deepMerge } from "./utils";
import { Cell } from "./Cell";
import { chalkFgColors } from "./tableTypes";

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

    if (alternateRows) {
      // Iterate over rows, cycling through alternateRows colors
      let alternateRowIdx = 0;
      let i = 0;
      this._table.forEach((row) => {
        const rowIsPrimary =
          row.find((cell) => cell.type === "primary") !== undefined;
        if (rowIsPrimary) {
          alternateRowIdx = i % alternateRows.length;
          i++;
        }

        row.forEach((cell) => {
          const styledString = this.getValidChalkString(
            cell.content,
            alternateRows[alternateRowIdx]
          );
          if (cell.type !== "border") {
            cell.content = styledString;
          }
        });
      });
    }
    if (borderColor) {
      this._table.forEach((row) => {
        row.forEach((cell) => {
          if (cell.type === "border") {
            const styledString = this.getValidChalkString(
              cell.content,
              borderColor
            );
            cell.content = styledString;
          }
        });
      });
    }
  }

  getValidChalkString(cellString: string, cellStyle: CellStyle): string {
    let { fgColor, bgColor, style } = cellStyle;
    let formattedFgColor = "";
    let formattedBgColor = "";
    let formattedStyle = "";

    // Create a formatted chalk string from the values in the color object
    if (fgColor !== undefined) {
      const isHex = fgColor.startsWith("#");
      if (isHex) {
        // Remove alpha channel from hex color if it exists
        if (fgColor.length === 9) fgColor = fgColor.slice(0, -2);
        formattedFgColor = `hex('${fgColor}')` || "";
      } else {
        formattedFgColor = `keyword('${fgColor}')` || "";
      }
    } else if (bgColor !== undefined) {
      const isHex = bgColor.startsWith("#") || "";
      if (isHex) {
        // Remove alpha channel from hex color if it exists
        if (bgColor.length === 9) bgColor = bgColor.slice(0, -2);
        formattedBgColor = `bgHex('${bgColor}')` || "";
      } else {
        formattedBgColor = `bgKeyword('${bgColor}')` || "";
      }
      if (formattedFgColor) formattedBgColor = `.${formattedBgColor}`;
    } else {
      formattedStyle = `${style}` || "";
      if (formattedFgColor || formattedStyle)
        formattedBgColor = `.${formattedBgColor}`;
    }
    return chalk`{${formattedFgColor}${formattedBgColor}${formattedStyle} ${cellString}}`;
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
          if (idx > 0 && row[0].type === "primary") acc.push(idx);
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
    const border = this.createHorizontalBorder(type);
    const insertIdxs = this.findHorizontalBorderInsertIdxs(type);

    for (let i = insertIdxs.length - 1; i >= 0; i--) {
      this._table.splice(insertIdxs[i], 0, border);
    }
  }

  insertVerticalBorder(type: VerticalBorderType) {
    for (let i = 0; i < this._table.length; i++) {
      const row = this._table[i];
      const rowNeedsBorder =
        row.find(
          (cell) => cell.type === "primary" || cell.type === "overflow"
        ) !== undefined;
      if (rowNeedsBorder) {
        const rowWithBorder = this.createVerticalBorder(row, type);
        this._table[i] = rowWithBorder;
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

  createHorizontalBorder(type: HorizontalBorderType): CellType[] {
    const { sides, glyphs } = this._options.borders as CustomBorders;
    let horizontalLine = glyphs.horizontalLine;
    const { leftEdge, rightEdge, separator } =
      this.getGlyphsForBorderType(type);

    let borderRow: CellType[] = [];

    this._colWidths.forEach((colWidth, idx) => {
      // Border segment is the same length as the column
      const baseBorderCell = new Cell(
        "border",
        horizontalLine.repeat(colWidth),
        colWidth
      );

      // If there are borders between columns add the separator
      if (idx === 0) {
        // Far left column
        if (sides.left) {
          const leftEdgeCell = new Cell("border", leftEdge, 1);
          borderRow.push(leftEdgeCell, baseBorderCell);
        } else borderRow.push(baseBorderCell);
        if (sides.betweenColumns) {
          const separatorCell = new Cell("border", separator, 1);
          borderRow.push(separatorCell);
        }
      } else if (idx === this._colWidths.length - 1) {
        // Far right column
        if (sides.right) {
          const rightEdgeCell = new Cell("border", rightEdge, 1);
          borderRow.push(baseBorderCell, rightEdgeCell);
        } else borderRow.push(baseBorderCell);
      } else {
        // Middle column
        borderRow.push(baseBorderCell);
        if (sides.betweenColumns) {
          const separatorCell = new Cell("border", separator, 1);
          borderRow.push(separatorCell);
        }
      }
    });

    return borderRow;
  }

  createVerticalBorder(row: CellType[], type: VerticalBorderType): CellType[] {
    const { sides } = this._options.borders as CustomBorders;
    const { verticalLine } = this.getGlyphsForBorderType(type);
    const verticalLineCell: CellType = new Cell("border", verticalLine, 1);

    if (type === "left") return [verticalLineCell, ...row];
    else if (type === "right") return [...row, verticalLineCell];
    else {
      // border === "betweenColumns"
      const newRow: CellType[] = [];
      row.map((cell, colIdx) => {
        const isFirstCol = colIdx === 0;
        const isLastCol = colIdx === row.length - 1;
        // If the cell is the first or last column, is a border cell, or is the last cell in the row
        // then push the cell to the new row with no vertical line
        if (
          (isFirstCol && sides.left) ||
          (isLastCol && sides.right) ||
          cell.type === "border" ||
          colIdx === row.length - 2
        ) {
          return newRow.push(cell);
        }
        // Otherwise push the cell to the new row with a vertical line
        return newRow.push(cell, verticalLineCell);
      });
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
