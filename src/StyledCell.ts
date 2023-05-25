import { Cell } from "./Cell";
import { StyleHelper } from "./StyleHelper";
import { CellType, StyleObj } from "./tableTypes";

export class StyledCell extends Cell {
  style: StyleObj;
  styledContent: string;

  constructor(cell: Cell, style: StyleObj) {
    super(cell.type, cell.content, cell.length);
    this.style = style;
    this.styledContent = this.getStyledContent(style);
  }

  private getStyledContent(style: StyleObj): string {
    const { fgColor, bgColor, modifier } = style;
    return StyleHelper.createStyledString(
      this.content,
      fgColor,
      bgColor,
      modifier
    );
  }

  reStyle(style: StyleObj): void {
    this.style = style;
    this.styledContent = this.getStyledContent(style);
  }
}
