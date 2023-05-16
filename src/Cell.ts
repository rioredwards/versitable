import { countCharsWithEmojis } from "./emojis";
import { Align, CellType, CellTypes } from "./tableTypes";

export class Cell implements CellType {
  type: CellTypes;
  content: string;
  length: number;
  color?: string;

  constructor(
    type: CellTypes = "primary",
    content: string = "",
    length?: number,
    color?: string
  ) {
    this.type = type;
    this.content = content;
    this.length = length || countCharsWithEmojis(content);
    this.color = color || undefined;
  }

  splitAt(index: number): Cell {
    const overflowContent = this.content.substring(index);
    const overflowLength = this.length - index;
    this.content = this.content.substring(0, index);
    this.length = index;
    return new Cell("overflow", overflowContent, overflowLength);
  }

  pad(padLength: number, align: Align = "left"): void {
    let paddedContent: string;
    switch (align) {
      case "left":
        paddedContent = " ".repeat(padLength) + this.content;
        break;
      case "right":
        paddedContent = this.content + " ".repeat(padLength);
        break;
      case "center":
        const leftPadLength = Math.floor(padLength / 2);
        const rightPadLength = Math.ceil(padLength / 2);
        paddedContent =
          " ".repeat(leftPadLength) + this.content + " ".repeat(rightPadLength);
        break;
      default:
        throw new Error("Invalid alignment");
    }
    const paddedLength = this.length + padLength;
    this.content = paddedContent;
    this.length = paddedLength;
  }
}
