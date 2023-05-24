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
  TargetCellStyle,
} from "./tableTypes";
import {
  checkTableIsValid,
  checkTableOptionsAreValid,
} from "./inputValidations";
import { alternate, deepMerge, nullUndefinedOrFalse } from "./utils";
import { Cell } from "./Cell";
import { StyleHelper } from "./StyleHelper";
import { Row } from "./Row";
import { RowFactory } from "./RowFactory";
import { VersitableFacade } from "./VersitableFacade";
import { ComplexOptions } from "./tableTypes";

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
    return versitable._rows.map((row) => row.cells.map((cell) => cell.content));
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

  getNonBorderRowIdxs(): number[] {
    return this._rows.reduce((acc, row, idx) => {
      if (!this.isBorderRow(row)) {
        acc.push(idx);
      }
      return acc;
    }, [] as number[]);
  }

  getNonBorderColIdxs(): number[] {
    const referenceRow = this.getNonBorderRowByIdx(0);
    return referenceRow.getNonBorderIdxs();
  }

  getNonBorderRows(): Row[] {
    const nonBorderRowIdxs = this.getNonBorderRowIdxs();
    return nonBorderRowIdxs.reduce((acc, rowIdx) => {
      acc.push(this._rows[rowIdx]);
      return acc;
    }, [] as Row[]);
  }

  getNonBorderRowByIdx(rowIdx: number): Row {
    const adjustedRowIdx = this.getNonBorderRowIdxs()[rowIdx];
    return this._rows[adjustedRowIdx];
  }

  getColByIdx(colIdx: number): Cell[] {
    return this._rows.map((row) => row.cellAtIdx(colIdx));
  }

  getNonBorderColByIdx(colIdx: number): Cell[] {
    const adjustedColIdx = this.getNonBorderColIdxs()[colIdx];
    return this.getColByIdx(adjustedColIdx);
  }

  getCols(): Cell[][] {
    const colIdxs = Array.from({ length: this.colCount }, (_, i) => i);
    return colIdxs.map((colIdx) => this.getColByIdx(colIdx));
  }

  getNonBorderCols(): Cell[][] {
    const nonBorderColIdxs = this.getNonBorderColIdxs();
    return nonBorderColIdxs.map((colIdx) => this.getColByIdx(colIdx));
  }

  getNonBorderCellByCoords(rowIdx: number, colIdx: number): Cell {
    const adjustedRowIdx = this.getNonBorderRowIdxs()[rowIdx];
    const adjustedColIdx = this.getNonBorderColIdxs()[colIdx];
    return this.getCellByCoords(adjustedRowIdx, adjustedColIdx);
  }

  getCellByCoords(rowIdx: number, colIdx: number): Cell {
    return this._rows[rowIdx].cellAtIdx(colIdx);
  }

  isBorderRow(row: Row): boolean {
    return row.type !== "primary" && row.type !== "overflow";
  }

  isBorderCell(cell: Cell) {
    if (cell.type !== "primary" && cell.type !== "overflow") return true;
    return false;
  }

  isOuterBorderCell(cell: Cell) {
    if (this.isBorderCell(cell) && !this.isInnerBorderCell(cell)) return true;
    return false;
  }

  isInnerBorderCell(cell: Cell) {
    if (cell.type === "betweenColumns" || cell.type === "betweenRows")
      return true;
    return false;
  }

  borderExists(type: AnyBorder) {
    return (
      !!this.borders.sides && !nullUndefinedOrFalse(this.borders.sides[type])
    );
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

  addRowStyles(rowStyles: PartialCellStyle[], borderStyle?: PartialCellStyle) {
    if (!rowStyles) return;

    const isAlternating = rowStyles.length > 1;
    let rowStylesIdx = 0; // iterator for rowStyles when alternating

    this._rows.forEach((row, rowIdx) => {
      const rowType = this.getRowTypes()[rowIdx];
      const needRowStyle = this.checkRowNeedsStyle("rowStyles", rowType);
      if (!needRowStyle) return;
      const needAvgColor = this.checkAvgBgColorNeeded(
        rowType,
        rowStyles,
        rowStylesIdx
      );

      // save style from previous cell if it exists because style doesn't change across row
      let savedRowStyle: PartialCellStyle | undefined = undefined;
      let avgRowBgColor: string | undefined = undefined;

      row.cells.forEach((cell) => {
        if (this.isOuterBorderCell(cell)) return;
        // Save style from previous cell if it exists
        // Cycle through rowStyles if alternating
        let cellStyle = savedRowStyle ?? alternate(rowStyles, rowStylesIdx);

        // If cell is a betweenRow border cell, calculate avg bg color from adjacent rows
        if (needAvgColor && !avgRowBgColor) {
          const aboveCellBgColor = alternate(rowStyles, rowStylesIdx).bgColor;
          const nextRowBgColor = alternate(rowStyles, rowStylesIdx + 1).bgColor;
          avgRowBgColor = StyleHelper.calcAvgColor(
            aboveCellBgColor!,
            nextRowBgColor!
          );
        }

        // Adjust cellStyle if cell is a border
        if (this.isInnerBorderCell(cell)) {
          if (borderStyle) {
            cellStyle = {
              ...borderStyle,
            };
          }
          // Add different bgColor based on if cell is betweenRows or betweenCols
          cellStyle.bgColor =
            cell.type === "betweenRows"
              ? avgRowBgColor
              : savedRowStyle!.bgColor;
        }

        // Color is determined, so apply it to the cell and save it for the next cells
        savedRowStyle ??= cellStyle;
        const styledString = this.createStyledCell(cell.content, cellStyle);
        cell.content = styledString;
      });

      // Alternate rowStylesIdx if next row is a primary row
      const nextRow =
        rowIdx < this.rowCount - 1 ? this._rows[rowIdx + 1] : undefined;
      if (isAlternating && nextRow?.type === "primary") {
        rowStylesIdx++;
      }
    });
  }

  addBorderStyles(borderStyle: PartialCellStyle) {
    if (!borderStyle) return;
    this._rows.forEach((row) => {
      row.cells.forEach((cell) => {
        if (this.isOuterBorderCell(cell)) {
          const styledString = this.createStyledCell(cell.content, borderStyle);
          cell.content = styledString;
        }
      });
    });
  }

  addTargetCellStyles(targetCellStyles: TargetCellStyle[]) {
    if (!targetCellStyles) return;
    targetCellStyles.forEach((targetCellStyle) => {
      const { column, row } = targetCellStyle;
      if (column && row) {
        // If column and row specified, apply style to that single cell
        const cell = this.getNonBorderCellByCoords(row, column);
        const styledString = this.createStyledCell(
          cell.content,
          targetCellStyle
        );
        cell.content = styledString;
      } else if (column) {
        // If only column specified, apply style to all cells in that column
        this.getNonBorderColByIdx(column).forEach((cell) => {
          const styledString = this.createStyledCell(
            cell.content,
            targetCellStyle
          );
          cell.content = styledString;
        });
      } else {
        // If only row specified, apply style to all cells in that row
        this.getNonBorderRowByIdx(row!).cells.forEach((cell) => {
          const styledString = this.createStyledCell(
            cell.content,
            targetCellStyle
          );
          cell.content = styledString;
        });
      }
    });
  }

  checkRowNeedsStyle(styleType: keyof CustomStyles, rowType: RowType) {
    switch (styleType) {
      case "rowStyles":
        switch (rowType) {
          case "primary":
          case "overflow":
          case "innerBorder":
            return true;
          default:
            return false;
        }
      default:
        return false;
    }
  }

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

    this.addRowStyles(rowStyles, borderStyle);
    this.addBorderStyles(borderStyle);
    this.addTargetCellStyles(targetCellStyles);
  }

  createStyledCell(cellString: string, styleObj: StyleObj): string {
    // StyleHelper.validateColor(styleObj.color); // TODO
    const { fgColor, bgColor, modifier } = styleObj;
    return StyleHelper.createStyledString(
      cellString,
      fgColor,
      bgColor,
      modifier
    );
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
        insertIdxs = this.getRowTypes().reduce((acc, type, idx) => {
          if (idx > 0 && type === "primary") acc.push(idx);
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
