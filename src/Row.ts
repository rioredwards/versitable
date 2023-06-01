import { Cell } from "./Cell";
import {
  AnyBorder,
  AnyCellType,
  RegularCellContent,
  RowType,
} from "./tableTypes";

export class Row {
  cells: AnyCellType[];

  constructor(cells: AnyCellType[]) {
    this.cells = cells;
  }

  get length(): number {
    return this.cells.length;
  }

  getType(): RowType {
    const definingCell = this.getBorders().has("left")
      ? this.cells[1]
      : this.cells[0];
    if (definingCell.isBorder()) {
      switch (definingCell.type) {
        case "top":
          return "upperBorder";
        case "bottom":
          return "lowerBorder";
        case "betweenRows":
          return "innerBorder";
        default:
          break;
      }
    }
    return definingCell.type as RegularCellContent;
  }

  getBorders(): Set<AnyBorder> {
    const borderTypes: Set<AnyBorder> = new Set();
    this.cells.forEach((cell) => {
      if (cell.isBorder()) borderTypes.add(cell.type as AnyBorder);
    });
    return borderTypes;
  }

  getCellsByIdxs(idxs: number[]): AnyCellType[] {
    return idxs.map((idx) => this.cells[idx]);
  }

  getNonBorderCells(): AnyCellType[] {
    return this.cells.filter((cell) => !cell.isBorder());
  }

  getNonBorderIdxs(): number[] {
    return this.cells.reduce((acc, cell, idx) => {
      if (!cell.isBorder()) {
        acc.push(idx);
      }
      return acc;
    }, [] as number[]);
  }

  splice(
    startIdx: number,
    deleteCount: number,
    ...insertCells: AnyCellType[]
  ): void {
    this.cells.splice(startIdx, deleteCount, ...insertCells);
  }

  cellAtIdx(idx: number): AnyCellType {
    return this.cells[idx];
  }

  getCellSubset(filterFn: (cell: AnyCellType) => boolean): AnyCellType[] {
    return this.cells.filter(filterFn);
  }

  insertCellAtIdx(idx: number, cell: Cell): void {
    this.cells.splice(idx, 0, cell);
  }

  findIdxsCellsAboveLengths(lengths: number[]): number[] {
    return this.cells.reduce((acc: number[], cell: Cell, idx: number) => {
      if (cell.length > lengths[idx]) {
        acc.push(idx);
      }
      return acc;
    }, [] as number[]);
  }

  splitAtCellLengths(lengths: number[]): Row | undefined {
    const idxsAboveLengths = this.findIdxsCellsAboveLengths(lengths);
    if (idxsAboveLengths.length === 0) return undefined;

    // Create new row with empty overflow cells
    const rowLength = this.length;
    const emptyOverflowCells = Array.from(
      { length: rowLength },
      () => new Cell("overflow")
    );
    const overflowRow = new Row(emptyOverflowCells);

    // Split cells that are too long and insert into overflow row
    idxsAboveLengths.forEach((idx) => {
      const tooLongCell = this.cellAtIdx(idx);
      const overflowCell = tooLongCell.splitAt(lengths[idx]);
      overflowRow.splice(idx, 1, overflowCell);
    });
    return overflowRow;
  }
}
