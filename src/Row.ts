import { Cell } from "./Cell";
import { BorderGlyphs, VerticalGlyphs } from "./tableTypes";
import {
  AnyBorder,
  CellType,
  HorizontalBorder,
  ICell,
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

  static createRowFromStrings(
    cellContents: string[],
    type: CellType = "primary"
  ): Row {
    const cells = cellContents.map((content) => {
      return new Cell(type, content);
    });
    return new Row(cells);
  }

  static createBlankRowOfType(length: number, type: CellType): Row {
    const cells = Array.from({ length }, () => new Cell(type));
    return new Row(cells);
  }

  static createHorizontalBorder(
    type: HorizontalBorder,
    colWidths: number[],
    borderGlyph: string
  ): Row {
    const cells = colWidths.map((width) => {
      return new Cell(type, borderGlyph.repeat(width));
    });
    return new Row(cells);
  }

  static createRowWithVerticalBorders(
    borderType: VerticalBorder,
    originalRow: Row,
    borderGlyphs: VerticalGlyphs
  ): Row {
    const { verticalLine, topEdge, bottomEdge, separator } = borderGlyphs;

    if (borderType === "left" || borderType === "right") {
      let borderGlyph: string;

      switch (originalRow.type) {
        case "upperBorder":
          borderGlyph = topEdge;
          break;
        case "lowerBorder":
          borderGlyph = bottomEdge;
          break;
        case "innerBorder":
          borderGlyph = separator;
          break;
        default:
          borderGlyph = verticalLine;
          break;
      }

      const newBorderCell = new Cell(borderType, borderGlyph, 1);
      if (borderType === "left") {
        return new Row([newBorderCell, ...originalRow.cells]);
      } else {
        return new Row([...originalRow.cells, newBorderCell]);
      }
    } else {
      // border === "betweenColumns"
      const newCells = originalRow.cells.reduce((acc: Cell[], cell, colIdx) => {
        const isLastCol = colIdx === originalRow.length - 1;
        if (isLastCol) {
          acc.push(cell);
        } else if (cell.type === "top" || cell.type === "bottom") {
          const borderGlyph = cell.type === "top" ? topEdge : bottomEdge;
          const newBorderCell = new Cell(cell.type, borderGlyph, 1);
          acc.push(cell, newBorderCell);
        } else {
          const isBetweenRows = cell.type === "betweenRows";
          const borderGlyph = isBetweenRows ? separator : verticalLine;
          const cellType = isBetweenRows ? "betweenRows" : "betweenColumns";
          const newBorderCell = new Cell(cellType, borderGlyph, 1);
          acc.push(cell, newBorderCell);
        }
        return acc;
      }, []);
      return new Row(newCells);
    }
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
