import { Cell } from "./Cell";
import {
  AnyBorder,
  ICell,
  IRow,
  RegularCellContent,
  RowType,
} from "./tableTypes";

export class Row implements IRow {
  cells: ICell[];

  constructor(cells: ICell[]) {
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

  static createRowFromStrings(
    cellContents: string[],
    type: RegularCellContent = "primary"
  ): Row {
    const cells = cellContents.map((content) => {
      return new Cell(type, content);
    });
    return new Row(cells);
  }

  slice(startIdx: number, endIdx: number): void {
    this.cells.splice(startIdx, endIdx);
  }
}
