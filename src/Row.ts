import { Cell } from "./Cell";
import { VerticalGlyphs } from "./tableTypes";
import {
  AnyBorder,
  CellType,
  HorizontalBorder,
  IRow,
  RegularCellContent,
  RowType,
  VerticalBorder,
} from "./tableTypes";

export class Row implements IRow {
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

  splice(startIdx: number, endIdx: number): void {
    this.cells.splice(startIdx, endIdx);
  }

  getCellByIdx(idx: number): Cell {
    return this.cells[idx];
  }

  addCellByIdx(idx: number, cell: Cell): void {
    this.cells.splice(idx, 0, cell);
  }
}
