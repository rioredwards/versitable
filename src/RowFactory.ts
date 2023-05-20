import { Cell } from "./Cell";
import { Row } from "./Row";
import {
  CellType,
  HorizontalBorder,
  VerticalBorder,
  VerticalGlyphs,
} from "./tableTypes";

export class RowFactory {
  static createRowFromCells(cells: Cell[]): Row {
    return new Row(cells);
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

  static createBlankRowOfLength(length: number, type: CellType): Row {
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
}
