import { Cell } from "../src/Cell";
import { StyleObj } from "../src/tableTypes";

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
      const overFlowCell = cell.splitAt(4);
      expect(cell.content).toBe("some");
      expect(overFlowCell.content).toBe(" content");
    });
    it("split cell should have correct overflow type", () => {
      const content = "some content";
      const primaryCell = new Cell("primary", "some content", content.length);
      const primaryOverFlowCell = primaryCell.splitAt(4);
      expect(primaryCell.type).toBe("primary");
      expect(primaryOverFlowCell.type).toBe("primaryOverflow");

      const headerCell = new Cell("header", "some content", content.length);
      const headerOverFlowCell = headerCell.splitAt(4);
      expect(headerCell.type).toBe("header");
      expect(headerOverFlowCell.type).toBe("headerOverflow");
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
    describe("should return true if the cell is a ", () => {
      it("top cell", () => {
        const cell = new Cell("top", "content", 7);
        expect(cell.isBorder()).toBe(true);
      });
      it("bottom cell", () => {
        const cell = new Cell("bottom", "content", 7);
        expect(cell.isBorder()).toBe(true);
      });
      it("left cell", () => {
        const cell = new Cell("left", "content", 7);
        expect(cell.isBorder()).toBe(true);
      });
      it("right cell", () => {
        const cell = new Cell("right", "content", 7);
        expect(cell.isBorder()).toBe(true);
      });
      it("betweenColumns cell", () => {
        const cell = new Cell("betweenColumns", "content", 7);
        expect(cell.isBorder()).toBe(true);
      });
      it("betweenRows cell", () => {
        const cell = new Cell("betweenRows", "content", 7);
        expect(cell.isBorder()).toBe(true);
      });
    });
    describe("should return false if the cell is a ", () => {
      it("primary cell", () => {
        const cell = new Cell("primary", "content", 7);
        expect(cell.isBorder()).toBe(false);
      });
      it("primaryOverflow cell", () => {
        const cell = new Cell("primaryOverflow", "content", 7);
        expect(cell.isBorder()).toBe(false);
      });
      it("header cell", () => {
        const cell = new Cell("header", "content", 7);
        expect(cell.isBorder()).toBe(false);
      });
      it("headerOverflow cell", () => {
        const cell = new Cell("headerOverflow", "content", 7);
        expect(cell.isBorder()).toBe(false);
      });
    });
  });
});
