import { Cell } from "../src/Cell";
import { RowFactory } from "../src/RowFactory";

describe("RowFactory: ", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("createRowFromCells: ", () => {
    it("should create a row from strings", () => {
      const cell1 = new Cell("primary", "one");
      const cell2 = new Cell("primaryOverflow", "two");
      const row = RowFactory.createRowFromCells([cell1, cell2]);
      expect(row.cells.length).toBe(2);
      expect(row.cells[0].type).toBe("primary");
      expect(row.cells[1].content).toBe("two");
      expect(row.cells[1].type).toBe("primaryOverflow");
    });
  });

  describe("createRowFromStrings: ", () => {
    it("should create a row from strings", () => {
      const row = RowFactory.createRowFromStrings(["one", "two"]);
      expect(row.cells.length).toBe(2);
      expect(row.cells[0].content).toBe("one");
      expect(row.cells[1].content).toBe("two");
    });
  });

  describe("createBlankRowOfLength: ", () => {
    it("should create a blank row of a given length with a given type", () => {
      const row = RowFactory.createBlankRowOfLength(4, "primary");
      expect(row.cells.length).toBe(4);
      expect(row.cells[0].type).toBe("primary");
    });
  });

  describe("createHorizontalBorder", () => {
    it("should create a horizontal border", () => {
      const row = RowFactory.createHorizontalBorder("top", [4, 4], "-");
      expect(row.cells.length).toBe(2);
      expect(row.cells[0].type).toBe("top");
      expect(row.cells[1].content).toBe("----");
    });
  });

  describe("createRowWithVerticalBorders", () => {
    it("should create a row with vertical borders", () => {
      const originalRow = RowFactory.createRowFromStrings(["one", "two"]);
      const row = RowFactory.createRowWithVerticalBorders("left", originalRow, {
        verticalLine: "|",
        topEdge: "┌",
        bottomEdge: "└",
        separator: "├",
      });
      expect(row.cells.length).toBe(3);
      expect(row.cells[0].content).toBe("|");
      expect(row.cells[1].content).toBe("one");
      expect(row.cells[2].content).toBe("two");
    });
  });
});
