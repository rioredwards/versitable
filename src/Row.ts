import { Cell } from "./Cell";
import { AnyBorder, RegularCellContent, RowType } from "./tableTypes";

export class Row {
  cells: Cell[];

  constructor(cells: Cell[]) {
    this.cells = cells;
  }

  get length(): number {
    return this.cells.length;
  }

  get type(): RowType {
    const definingCell = this.borders.has("left")
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

  get borders(): Set<AnyBorder> {
    const borderTypes: Set<AnyBorder> = new Set();
    this.cells.forEach((cell) => {
      if (cell.isBorder()) borderTypes.add(cell.type as AnyBorder);
    });
    return borderTypes;
  }

  findCellsAboveLengths(length: number[]): [Cell[], number[]] {
    return this.cells.reduce(
      (acc: [Cell[], number[]], cell: Cell, idx: number) => {
        if (cell.length > length[idx]) {
          acc[0].push(cell);
          acc[1].push(idx);
        }
        return acc;
      },
      [[], []] as [Cell[], number[]]
    );
  }

  splice(startIdx: number, deleteCount: number, ...insertCells: Cell[]): void {
    this.cells.splice(startIdx, deleteCount, ...insertCells);
  }

  cellAtIdx(idx: number): Cell {
    return this.cells[idx];
  }

  insertCellAtIdx(idx: number, cell: Cell): void {
    this.cells.splice(idx, 0, cell);
  }
}
