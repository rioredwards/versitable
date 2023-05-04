import { versitable } from "../src";
import {
  invalidTableData,
  invalidTableOptions,
} from "./__mocks__/invalidTableData";
import { validTableData, validTableOptions } from "./__mocks__/validTableData";

describe("checkTableIsValid", () => {
  it("should throw an error if logLevel is set to 'error' and table argument is invalid", () => {});
});

describe("versitable.create", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("should create a string[][] if passed in a string[][]", () => {
    const table = versitable.create(validTableData);
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
    const table = versitable.create(validTableData, validTableOptions);
    expect(table).toBeInstanceOf(Array);
    expect(table[0]).toBeInstanceOf(Array);
    expect(typeof table[0][0]).toBe("string");
  });

  it("should error if passed in invalid options (with strict mode)", () => {
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
    // This doesn't work anymore because rows can have height > 1
    // const table = versitable.create(validTableData, { maxRows: 10 });
    // expect(table.length).toBeLessThanOrEqual(10);

    const table = versitable.create(validTableData, {
      maxRows: 10,
      maxRowHeight: 1,
    });
    expect(table.length).toBeLessThanOrEqual(10);
  });

  it("should limit the columns created based on the maxColumns option", () => {
    const table = versitable.create(validTableData, { maxColumns: 2 });
    expect(table[0].length).toBeLessThanOrEqual(2);
  });

  it("should truncate the cells based on the maxColWidths option", () => {
    const table = versitable.create(validTableData, {
      maxColWidths: 7,
      cellPadding: 0,
    });
    expect(table[0][0].length).toBeLessThanOrEqual(7);
  });
});
