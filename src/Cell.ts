import { countCharsWithEmojis } from "./emojis";
import { TextAlign, CellType, StyleObj, PaddingPlacement } from "./tableTypes";

export class Cell {
  type: CellType;
  content: string;
  length: number;

  constructor(
    type: CellType = "primary",
    content: string = "",
    length: number = countCharsWithEmojis(content)
  ) {
    this.type = type;
    this.content = content;
    this.length = length;
  }

  truncate(length: number): void {
    this.content = this.content.substring(0, length);
    this.length = length;
  }

  // Splits cell into two cells at index. Mutates the original cell and returns new cell with overflow.
  splitAt(index: number): Cell {
    const overflowContent = this.content.substring(index);
    const overflowLength = this.length - index;
    this.truncate(index);
    const newCellType =
      this.type === "primary" ? "primaryOverflow" : "headerOverflow";
    return new Cell(newCellType, overflowContent, overflowLength);
  }

  pad(padLength: number, paddingPlacement: PaddingPlacement = "left"): void {
    let paddedContent: string;
    switch (paddingPlacement) {
      case "right":
        paddedContent = this.content + " ".repeat(padLength);
        break;
      case "left":
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
    this.content = paddedContent;
    this.length += padLength;
  }

  isBorder(): boolean {
    switch (this.type) {
      case "header":
      case "headerOverflow":
      case "primary":
      case "primaryOverflow":
        return false;
      default:
        return true;
    }
  }
}
