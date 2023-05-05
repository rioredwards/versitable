import { versitable } from "../src";
import {
  BOTTOM_LEFT_CORNER,
  BOTTOM_RIGHT_CORNER,
  HORIZONTAL_LINE,
  TOP_LEFT_CORNER,
  TOP_RIGHT_CORNER,
  VERTICAL_LINE,
} from "../src/tableDefaults";
import {
  invalidTableData,
  invalidTableOptions,
} from "./__mocks__/invalidTableData";
import { validTableData, validTableOptions } from "./__mocks__/validTableData";

describe("versitable.create", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should create a string[][] if passed in a string[][]", () => {
    const table = versitable.create(validTableData, { borders: false });
    expect(table).toBeInstanceOf(Array);
    expect(table[0]).toBeInstanceOf(Array);
    expect(typeof table[0][0]).toBe("string");
  });

  it("should error if not passed a table with type: string[][]", () => {
    for (const element of invalidTableData) {
      expect(() => versitable.create(element)).toThrowError();
    }
  });

  it("should create a table if passed in valid options", () => {
    const table = versitable.create(validTableData, {
      ...validTableOptions,
      borders: false,
    });
    expect(table).toBeInstanceOf(Array);
    expect(table[0]).toBeInstanceOf(Array);
    expect(typeof table[0][0]).toBe("string");
  });

  it("should error if passed in invalid options", () => {
    for (const option of invalidTableOptions) {
      expect(() =>
        versitable.create(validTableData, {
          ...validTableOptions,
          ...option,
        } as any)
      ).toThrowError();
    }
  });

  it("should limit the rows created based on the maxRows option", () => {
    const table = versitable.create(validTableData, {
      borders: false,
      maxRows: 10,
      maxRowHeight: 1,
    });
    expect(table.length).toBeLessThanOrEqual(10);
  });

  it("should limit the columns created based on the maxColumns option", () => {
    const table = versitable.create(validTableData, {
      borders: false,
      maxColumns: 2,
    });
    expect(table[0].length).toBeLessThanOrEqual(2);
  });

  it("should truncate the cells based on the maxColWidths option", () => {
    const table = versitable.create(validTableData, {
      borders: false,
      maxColWidths: 7,
      cellPadding: 0,
    });
    expect(table[0][0].length).toBeLessThanOrEqual(7);
  });

  it.skip("should create a border around the table if border === true", () => {
    const table = versitable.create(validTableData, {
      borders: true,
    });
    expect(table[0][1]).toBe(HORIZONTAL_LINE);
    expect(table[1][0]).toBe(VERTICAL_LINE);
    expect(table[0][0]).toBe(TOP_LEFT_CORNER);
    expect(table[table.length - 1][0]).toBe(BOTTOM_LEFT_CORNER);
    expect(table[0][table[0].length - 1]).toBe(TOP_RIGHT_CORNER);
    expect(table[table.length - 1][table[0].length - 1]).toBe(
      BOTTOM_RIGHT_CORNER
    );
  });
});
