import { Cell } from "./Cell";

export class Row {
  cells: Cell[];

  constructor(cells: Cell[] = []) {
    this.cells = cells;
  }

  get type(): string {
    // Defined by first cell if cell is not left border
    // Otherwise defined by second cell
    return this.cells[0].type === "left"
      ? this.cells[1].type
      : this.cells[0].type;
  }

  limitRowLength(maxRowLength: number): Row {
    return new Row(this.cells.slice(0, maxRowLength));
  }
}
