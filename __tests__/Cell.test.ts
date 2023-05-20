import { Cell } from "../src/Cell";

describe("Cells: ", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("Constructor: ", () => {
    it("should create a cell without any parameters", () => {
      const cell = new Cell();
      expect(cell.type).toBe("primary");
      expect(cell.content).toBe("");
      expect(cell.length).toBe(0);
      expect(cell.color).toBeUndefined();
    });
    it("should create a cell with a type", () => {
      const cell = new Cell("overflow");
      expect(cell.type).toBe("overflow");
    });
    it("should create a cell with content", () => {
      const cell = new Cell("overflow", "content");
      expect(cell.content).toBe("content");
    });
    it("should create a cell with a length", () => {
      const cell = new Cell("overflow", "content", 7);
      expect(cell.length).toBe(7);
    });
    it("should create a cell with a color", () => {
      const cell = new Cell("overflow", "content", 7, "red");
      expect(cell.color).toBe("red");
    });
  });

  describe("splitAt: ", () => {
    it("should split a cell at the given index", () => {
      const content = "some content";
      const cell = new Cell("overflow", "some content", content.length);
      const [left, right] = cell.splitAt(4);
      expect(left.content).toBe("some");
      expect(right.content).toBe(" content");
    });
  });
});
