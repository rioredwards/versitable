import { versitable } from "../src";
import * as tableValidations from "../src/tableValidations";
import {
  invalidTableData,
  invalidTableOptions,
} from "./__mocks__/invalidTableData";
import { validTableData, validTableOptions } from "./__mocks__/validTableData";

describe("checkTableIsValid", () => {
  it("should throw an error if optionChecks is set to 'error' and option arguments are invalid", () => {
    expect(() =>
      versitable.create(validTableData, {
        optionChecks: "error",
        maxColWidths: -1,
      })
    ).toThrowError();
  });
  it("should log a warning if optionChecks is set to 'warn' and option arguments are invalid", () => {
    // check if warning was logged to console
    const warnMock = jest.spyOn(console, "warn").mockImplementation(() => {});

    versitable.create(validTableData, {
      optionChecks: "warn",
      maxColWidths: -1,
    });

    expect(warnMock).toHaveBeenCalled();
    warnMock.mockRestore();
  });
  it("should skip checks if optionChecks is set to 'skip' and option arguments are invalid", () => {
    // check if warning was logged to console
    const checkMock = jest
      .spyOn(tableValidations, "isValid")
      .mockImplementation(() => {});

    versitable.create(validTableData, {
      optionChecks: "skip",
      maxColWidths: -1,
    });

    expect(checkMock).toHaveBeenCalledTimes(0);
    checkMock.mockRestore();
  });
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
