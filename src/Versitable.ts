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
  AnyBorder,
  RowType,
  PartialCellStyle,
  ComplexOptions,
  Coords,
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./inputValidations";
import { alternate, deepMerge, nullUndefinedOrFalse } from "./utils";
import { Cell } from "./Cell";
import { Row } from "./Row";
import { RowFactory } from "./RowFactory";
import { VersitableFacade } from "./VersitableFacade";
import { StyledCell } from "./StyledCell";

// Main class which does all the work
export class Versitable {
  _rows: Row[];
  _colWidths: number[];
  _options: TableOptions;

  private constructor(
    inputTable: string[][],
    inputOptions?: PartialTableOptions
  ) {
    // Validations
    this.validateTable(inputTable);
    this.validateOptions(inputOptions);

    // Merge options with defaults
    this._options = this.deepMergeOptions(inputOptions, TABLE_DEFAULTS);

    // Limit Rows and Columns of input table
    const limitInputRowsTable = this.limitInputRows(inputTable);
    const limitInputColsTable = this.limitInputCols(limitInputRowsTable);

    // Create Rows from input table and mutate them as specified in options
    this._rows = this.createRowsFromStrings(limitInputColsTable);
    this._colWidths = this.calcColWidths();
    this.splitAndInsertRowsWithLengthyCells();
    this.padCells();
    this.addBordersToRows();
    this.addStylesToCells();
  }

  // This is how users will create a new table
  // It returns a VersitableFacade, which is the public interface
  static make(inputStrings: string[][], inputOptions?: PartialTableOptions) {
    const newVersitable = new Versitable(inputStrings, inputOptions);
    const stringTable = Versitable.stringifyTable(newVersitable);
    return new VersitableFacade(stringTable);
  }

  static stringifyTable(versitable: Versitable): string[][] {
    return versitable._rows.map((row) =>
      row.cells.map((cell) => {
        return cell instanceof StyledCell ? cell.styledContent : cell.content;
      })
    );
  }

  get rowCount(): number {
    return this._rows.length;
  }

  get colCount(): number {
    return this._rows[0].length;
  }

  get borders(): CustomBorders {
    return this._options.borders as CustomBorders;
  }

  get styles(): CustomStyles {
    return this._options.styles as CustomStyles;
  }

  getRowTypes(): RowType[] {
    return this._rows.map((row) => row.type);
  }

  getRowSubset(filterFn: (row: Row) => boolean): Row[] {
    return this._rows.filter(filterFn);
  }

  getColByIdx(colIdx: number): Cell[] {
    return this._rows.map((row) => row.cellAtIdx(colIdx));
  }

  getCols(): Cell[][] {
    const colIdxs = Array.from({ length: this.colCount }, (_, i) => i);
    return colIdxs.map((colIdx) => this.getColByIdx(colIdx));
  }

  getCellByCoords(coords: Coords): Cell {
    return this._rows[coords[0]].cellAtIdx(coords[1]);
  }

  borderExists(type: AnyBorder) {
    return (
      !!this.borders.sides && !nullUndefinedOrFalse(this.borders.sides[type])
    );
  }

  getRowIdxSubset(filterFn: (row: Row, idx: number) => boolean): number[] {
    return this._rows.reduce((acc, row, idx) => {
      if (filterFn(row, idx)) {
        acc.push(idx);
      }
      return acc;
    }, [] as number[]);
  }

  getColumnIdxSubset(filterFn: (col: Cell[]) => boolean): number[] {
    const cols = this.getCols();
    return cols.reduce((acc, col, idx) => {
      if (filterFn(col)) {
        acc.push(idx);
      }
      return acc;
    }, [] as number[]);
  }

  getCellCoordsSubsetByCellTypes(cellTypes: CellType[]): Coords[] {
    const cellCoords = this._rows.reduce((acc, row, rowIdx) => {
      row.cells.forEach((cell, colIdx) => {
        if (cellTypes.includes(cell.type)) {
          acc.push([rowIdx, colIdx]);
        }
      });
      return acc;
    }, [] as Coords[]);
    return cellCoords;
  }

  groupCoordsByPrimaryRow(cellCoords: Coords[]): Map<number, Coords[]> {
    cellCoords.sort((a, b) => a[0] - b[0]);
    const rowTypes = this.getRowTypes();

    return cellCoords.reduce((acc, [rowIdx, colIdx]) => {
      // If rowIdx is a primary row
      if (rowTypes[rowIdx] === "primary") {
        //-- if it doesn't exist as a key, add it to the accumulator as a key
        if (!acc.has(rowIdx)) {
          acc.set(rowIdx, [[rowIdx, colIdx]]);
        } else {
          //-- if it does exist as a key,
          //-- add it's coords to the key with the same rowIdx
          const rowCoords = acc.get(rowIdx);
          rowCoords!.push([rowIdx, colIdx]);
        }
      } else {
        // If it's not a primary row (overflow)
        //-- add it's coords to the last key
        const lastKey = Array.from(acc.keys()).pop();
        const rowCoords = acc.get(lastKey!);
        rowCoords!.push([rowIdx, colIdx]);
      }
      return acc;
    }, new Map<number, Coords[]>());
  }

  deepMergeOptions(
    inputOptions: PartialTableOptions = {},
    defaultOptions: TableOptions
  ) {
    const options = deepMerge(defaultOptions, inputOptions);
    options.borders = this.populateComplexOptWithDefaults("borders", options);
    options.styles = this.populateComplexOptWithDefaults("styles", options);
    return options;
  }

  // These options can be set as a boolean or an object
  // When set to true, they become the default object
  populateComplexOptWithDefaults<T extends ComplexOptions>(
    key: T,
    options: PartialTableOptions
  ): TableOptions[T] | false {
    if (typeof options[key] === "boolean") {
      if (options[key] === true) {
        return TABLE_DEFAULTS[key];
      } else return false;
    } else {
      return deepMerge(
        TABLE_DEFAULTS[key],
        options[key] as Partial<TableOptions[T]>
      );
    }
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

  addRowStyles(rowStyles: PartialCellStyle[]) {
    if (!rowStyles) return;

    const mainCellCoords = this.getCellCoordsSubsetByCellTypes([
      "primary",
      "overflow",
    ]);

    const coordsGroupedByPrimaryRow =
      this.groupCoordsByPrimaryRow(mainCellCoords);

    const isAlternating = rowStyles.length > 1;
    let rowStylesIdx = 0; // iterator for rowStyles when alternating
    coordsGroupedByPrimaryRow.forEach((coords) => {
      coords.forEach(([rowIdx, colIdx]) => {
        const cell = this.getCellByCoords([rowIdx, colIdx]);
        const cellStyle = alternate(rowStyles, rowStylesIdx);
        this._rows[rowIdx].splice(colIdx, 1, new StyledCell(cell, cellStyle));
      });
      rowStylesIdx = isAlternating ? rowStylesIdx + 1 : rowStylesIdx;
    });
  }

  addBorderStyles(borderStyle: PartialCellStyle) {
    if (!borderStyle) return;

    this.addOuterBorderStyles(borderStyle);
    this.addBetweenColumnBorderStyles(borderStyle);
  }

  addOuterBorderStyles(borderStyle: PartialCellStyle) {
    const outerBorderCellCoords = this.getCellCoordsSubsetByCellTypes([
      "top",
      "bottom",
      "left",
      "right",
    ]);

    outerBorderCellCoords.forEach((coords) => {
      this.transformCellAtCoordsToStyledCell(coords, borderStyle);
    });
  }

  addBetweenRowBorderStyles(borderStyle: PartialCellStyle) {}

  addBetweenColumnBorderStyles(borderStyle: PartialCellStyle) {
    const betweenColumnsCells = this.getCellCoordsSubsetByCellTypes([
      "betweenColumns",
    ]);

    betweenColumnsCells.forEach(([rowIdx, colIdx]) => {
      const adjacentCell = this._rows[rowIdx].cellAtIdx(colIdx - 1);
      if (!(adjacentCell instanceof StyledCell) || !adjacentCell.style.bgColor)
        return;
      const adjacentCellBgColor = adjacentCell.style.bgColor;
      const borderStyleWithAdjacentCellBgColor = {
        ...borderStyle,
        bgColor: adjacentCellBgColor,
      };
      this.transformCellAtCoordsToStyledCell(
        [rowIdx, colIdx],
        borderStyleWithAdjacentCellBgColor
      );
    });
  }

  // addTargetCellStyles(targetCellStyles: TargetCellStyle[]) {
  //   if (!targetCellStyles) return;
  //   targetCellStyles.forEach((targetCellStyle) => {
  //     const { column, row } = targetCellStyle;
  //     if (column !== undefined && row !== undefined) {
  //       // If column and row specified, apply style to that single cell
  //       const [adjustedRowIdx, adjustedColIdx] =
  //         this.convertCoordsToPrimaryCoords(row, column);
  //       this.transformCellAtCoordsToStyledCell(
  //         adjustedRowIdx,
  //         adjustedColIdx,
  //         targetCellStyle
  //       );
  //     } else if (column !== undefined) {
  //       // If only column specified, apply style to all cells in that column
  //       const cellsInColumn = this.getNonBorderColByIdx(column);
  //       cellsInColumn.forEach((cell) => {
  //         Object.assign(cell, new StyledCell(cell, targetCellStyle));
  //       });
  //     } else {
  //       // If only row specified, apply style to all cells in that row
  //       const targetRow = this.getNonBorderRowByIdx(row!);
  //       targetRow.cells.forEach((cell) => {
  //         Object.assign(cell, new StyledCell(cell, targetCellStyle));
  //       });
  //     }
  //   });
  // }

  checkAvgBgColorNeeded(
    rowType: RowType,
    rowStyles: PartialCellStyle[],
    rowStylesIdx: number
  ) {
    if (rowType !== "innerBorder") return false;
    if (rowStyles.length <= 1) return false;
    const prevRowBgColor = alternate(rowStyles, rowStylesIdx)?.bgColor;
    const nextRowBgColor = alternate(rowStyles, rowStylesIdx + 1)?.bgColor;
    if (!prevRowBgColor || !nextRowBgColor) return false;
    return true;
  }

  // Mutations to table
  addStylesToCells() {
    if (nullUndefinedOrFalse(this.styles)) return;

    const { targetCellStyles, rowStyles, borderStyle } = this.styles;

    this.addRowStyles(rowStyles);
    this.addBorderStyles(borderStyle);
    // this.addTargetCellStyles(targetCellStyles);
  }

  transformCellAtCoordsToStyledCell(coords: Coords, styleObj: StyleObj): void {
    const [rowIdx, colIdx] = coords;
    const targetCell = this._rows[rowIdx].cells[colIdx];
    this._rows[rowIdx].cells[colIdx] = new StyledCell(targetCell, styleObj);
  }

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

  // Helper methods
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

  splitAndInsertRowsWithLengthyCells(): void {
    const maxRowHeight = this._options.maxRowHeight;
    const originalRowCount = this.rowCount;
    let totalInsertRows = 0; // used to adjust rowIdx for inserted rows

    for (let i = 0; i < originalRowCount; i++) {
      const rowIdxWithInserts = i + totalInsertRows;
      let insertRows: Row[] = [];
      let rowToSplit: Row | undefined = this._rows[rowIdxWithInserts];

      while (insertRows.length < maxRowHeight - 1) {
        rowToSplit = rowToSplit.splitAtCellLengths(this._colWidths);
        // Exit loop if no cells in row are too long
        if (rowToSplit === undefined) break;
        insertRows.push(rowToSplit);
        // On the last run through the loop, split the last row incase it's too long
        if (insertRows.length === maxRowHeight - 1) {
          const lastRow = insertRows[insertRows.length - 1];
          lastRow.splitAtCellLengths(this._colWidths);
        }
      }

      // Add insert rows to table
      if (insertRows.length > 0) {
        this._rows.splice(rowIdxWithInserts + 1, 0, ...insertRows);
        totalInsertRows += insertRows.length;
        insertRows = [];
      }
    }
  }

  padCells(): void {
    for (let rowIdx = 0; rowIdx < this.rowCount; rowIdx++) {
      for (let colIdx = 0; colIdx < this.colCount; colIdx++) {
        const cell = this.getCellByCoords([rowIdx, colIdx]);
        const maxColWidth = this._colWidths[colIdx];
        const cellPadding =
          maxColWidth - cell.length + this._options.cellPadding;
        if (cellPadding > 0) {
          cell.pad(cellPadding, "center");
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
        insertIdxs = this.getRowIdxSubset(
          (row: Row, idx: number) => idx > 0 && row.type === "primary"
        );
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

  addBordersToRows(): void {
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
