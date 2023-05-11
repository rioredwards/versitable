import { CellType, CellTypes } from "./tableTypes";

export class Cell implements CellType {
  type: CellTypes;
  content: string;
  length: number;

  constructor(
    type: CellTypes = "primary",
    content: string = "",
    length: number = 0,
    color?: string
  ) {
    this.type = type;
    this.content = content;
    this.length = length;
  }
}
