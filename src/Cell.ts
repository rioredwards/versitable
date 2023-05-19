import { countCharsWithEmojis } from "./emojis";
import { Align, CellType, ICell } from "./tableTypes";

export class Cell implements ICell {
  type: CellType;
  content: string;
  length: number;
  color?: string;

  constructor(
    type: CellType = "primary",
    content: string = "",
    length: number = countCharsWithEmojis(content),
    color?: string
  ) {
    this.type = type;
    this.content = content;
    this.length = length;
    this.color = color;
  }

  // Splits cell into two cells at index. Mutates the cell and returns a new cell with the overflow content.
  splitAt(index: number): Cell {
    const remainderContent = this.content.substring(index);
    const remainderLength = this.length - index;
    this.content = this.content.substring(0, index);
    this.length = index;
    return new Cell("overflow", remainderContent, remainderLength);
  }

  pad(padLength: number, align: Align = "left"): void {
    let paddedContent: string;
    switch (align) {
      case "left":
        paddedContent = this.content + " ".repeat(padLength);
        break;
      case "right":
        paddedContent = " ".repeat(padLength) + this.content;
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

  isBorder(): boolean {
    return this.type !== "primary" && this.type === "overflow";
  }
}
