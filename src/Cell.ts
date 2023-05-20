import { countCharsWithEmojis } from "./emojis";
import { Align, CellType } from "./tableTypes";

export class Cell {
  type: CellType;
  content: string;
  length: number;
  style?: string;

  constructor(
    type: CellType = "primary",
    content: string = "",
    length: number = countCharsWithEmojis(content),
    style?: string
  ) {
    this.type = type;
    this.content = content;
    this.length = length;
    this.style = style;
  }

  truncateToLength(length: number): void {
    this.content = this.content.substring(0, length);
    this.length = length;
  }

  // Splits cell into two cells at index. Mutates the original cell and returns new cell with overflow.
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

  isBorder(): boolean {
    return this.type !== "primary" && this.type !== "overflow";
  }
}
