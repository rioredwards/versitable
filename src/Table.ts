import { TableOptions, VersitableType } from "./tableTypes";

class Versitable implements VersitableType {
  formattedTable: string[][];
  options: TableOptions;
  cellLengths: number[][];
  colWidths: number[];
  rowHeights: number[];
  borderRowIdxs: number[];
  borderColumnsIdxs: number[];

  constructor(inputTable: string[][], inputOptions: TableOptions) {
    this.formattedTable = inputTable;
    this.cellLengths = [];
    this.options = inputOptions;
    this.colWidths = [];
    this.rowHeights = [];
    this.borderRowIdxs = [];
    this.borderColumnsIdxs = [];
  }

  // User-facing functions
  log(): void {}

  // Mutations to formattedTable
  limitRows(): void {}
  limitCols(): void {}
  splitCells(): void {}
  padCells(): void {}
  addBorders(): void {}

  // Calculations for table properties
  calcCellLengths(): void {}
  calcColWidths(): void {}

  // Helper functions
  calcAdjustedMaxColWidths(): number[] {}
  arrFromMaxColWidths(): number[] {}
  longestStrLenInCol(): number[] {}
  padCell(cell: string, cellPadding: number): string {}
  newInsertRow(): string[] {}
  createHorizontalBorder(type: "top" | "bottom" | "between"): string[] {}
  createVerticalBorder(border: "left" | "right" | "between"): string[] {}
}
