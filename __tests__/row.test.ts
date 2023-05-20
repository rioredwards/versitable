import { Cell } from "../src/Cell";
import { Row } from "../src/Row";

describe("Rows: ", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("Constructor: ", () => {
    it("should create a row with cells", () => {
      const row = new Row([new Cell(), new Cell()]);
      expect(row.cells.length).toBe(2);
    });
  });

  describe("length: ", () => {
    it("should return the number of cells in the row", () => {
      const row = new Row([new Cell(), new Cell()]);
      expect(row.length).toBe(2);
    });
  });

  describe("type should return the type of the row when: ", () => {
    it("left border is NOT present", () => {
      const row = new Row([new Cell("overflow"), new Cell("overflow")]);
      expect(row.type).toBe("overflow");
    });
    it("left border IS present", () => {
      const row = new Row([new Cell("left"), new Cell("overflow")]);
      expect(row.type).toBe("overflow");
    });
    it("row contains top border cells", () => {
      const row = new Row([new Cell("top")]);
      expect(row.type).toBe("upperBorder");
    });
    it("row contains bottom border cells", () => {
      const row = new Row([new Cell("bottom")]);
      expect(row.type).toBe("lowerBorder");
    });
    it("row contains betweenRows border cells", () => {
      const row = new Row([new Cell("betweenRows")]);
      expect(row.type).toBe("innerBorder");
    });
  });

  describe("borders: ", () => {
    it("should return a set of border types", () => {
      const row = new Row([
        new Cell("top"),
        new Cell("bottom"),
        new Cell("betweenRows"),
      ]);
      expect(row.borders).toEqual(new Set(["top", "bottom", "betweenRows"]));
    });
    it("should return an empty set when no border cells are in row", () => {
      const row = new Row([
        new Cell("primary"),
        new Cell("overflow"),
        new Cell("primary"),
      ]);
      expect(row.borders).toEqual(new Set([]));
    });
  });

  describe("splice: ", () => {
    it("should remove cells from row", () => {
      const row = new Row([new Cell(), new Cell(), new Cell()]);
      row.splice(1, 2);
      expect(row.length).toBe(1);
    });
    it("should insert cells into row", () => {
      const row = new Row([new Cell(), new Cell()]);
      row.splice(1, 0, new Cell(), new Cell());
      expect(row.length).toBe(4);
    });
  });

  describe("cellAtIdx: ", () => {
    it("should return a cell", () => {
      const row = new Row([
        new Cell("overflow", "content1"),
        new Cell("primary", "content2"),
      ]);
      expect(row.cellAtIdx(0)).toBeInstanceOf(Cell);
      expect(row.cellAtIdx(1)).toBeInstanceOf(Cell);
      expect(row.cellAtIdx(0)).toEqual(new Cell("overflow", "content1"));
      expect(row.cellAtIdx(1)).toEqual(new Cell("primary", "content2"));
    });
  });

  describe("insertCellAtIdx: ", () => {
    it("should add a cell to the row", () => {
      const row = new Row([new Cell(), new Cell()]);
      row.insertCellAtIdx(1, new Cell());
      expect(row.length).toBe(3);
    });
  });
});
