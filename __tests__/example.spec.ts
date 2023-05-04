import { getStringUsers } from "./fixtures/faker";
import { versitable } from "../src";
import {
  invalidTableData,
  invalidTableOptions,
} from "./fixtures/invalidTableData";
import { validTableData, validTableOptions } from "./fixtures/validTableData";

const users = getStringUsers(5);

describe("versitable.create", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("temp test for debugging", () => {
    const updatedOptions = {
      ...validTableOptions,
      maxColWidths: [1, 10, 50],
      cellPPadding: 1,
    };
    const table = versitable.create(validTableData, updatedOptions);
    versitable.log(table, updatedOptions);
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
    const table = versitable.create(validTableData, { maxRows: 10 });
    expect(table.length).toBeLessThanOrEqual(10);
  });

  it("should limit the columns created based on the maxColumns option", () => {
    const table = versitable.create(validTableData, { maxColumns: 2 });
    expect(table[0].length).toBeLessThanOrEqual(2);
  });

  it("should truncate the cells based on the maxColWidths option", () => {
    const table = versitable.create(validTableData, { maxColWidths: 7 });
    expect(table[0][0].length).toBeLessThanOrEqual(7);
  });
});
