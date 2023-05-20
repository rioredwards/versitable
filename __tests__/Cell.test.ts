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
      expect(cell.style).toBeUndefined();
    });
    it("should create a cell with a type", () => {
      const cell = new Cell("primary");
      expect(cell.type).toBe("primary");
    });
    it("should create a cell with content", () => {
      const cell = new Cell("primary", "content");
      expect(cell.content).toBe("content");
    });
    it("should create a cell with a length", () => {
      const cell = new Cell("primary", "content", 7);
      expect(cell.length).toBe(7);
    });
    it("should create a cell with a color", () => {
      const cell = new Cell("primary", "content", 7, "red");
      expect(cell.style).toBe("red");
    });
  });

  describe("truncateToLength: ", () => {
    it("should truncate a cell to the given length", () => {
      const cell = new Cell("primary", "some content", 12);
      cell.truncateToLength(4);
      expect(cell.content).toBe("some");
      expect(cell.length).toBe(4);
    });
  });

  describe("splitAtIdx: ", () => {
    it("should split a cell at the given index", () => {
      const content = "some content";
      const cell = new Cell("primary", "some content", content.length);
      const [left, right] = cell.splitAtIdx(4);
      expect(left.content).toBe("some");
      expect(right.content).toBe(" content");
    });
  });

  describe("pad: ", () => {
    it("should pad a cell with spaces on the left", () => {
      const cell = new Cell("primary", "content", 7);
      cell.pad(3, "left");
      expect(cell.content).toBe("   content");
    });
    it("should pad a cell with spaces on the right", () => {
      const cell = new Cell("primary", "content", 7);
      cell.pad(3, "right");
      expect(cell.content).toBe("content   ");
    });
    it("should pad a cell with spaces on both sides", () => {
      const cell = new Cell("primary", "content", 7);
      cell.pad(3, "center");
      expect(cell.content).toBe(" content  ");
    });
  });

  describe("isBorder", () => {
    it("should return true if the cell is a border", () => {
      const cell = new Cell("top", "content", 7);
      expect(cell.isBorder()).toBe(true);
    });
    it("should return false if the cell is not a border", () => {
      const cell = new Cell("primary", "content", 7);
      expect(cell.isBorder()).toBe(false);
    });
  });
});
