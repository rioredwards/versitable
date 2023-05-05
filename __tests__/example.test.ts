import { versitable } from "../src";
import * as tableValidations from "../src/tableValidations";
import {
  invalidCellPaddings,
  invalidMaxColWidths,
  invalidMaxColumns,
  invalidMaxRows,
  invalidTableData,
  invalidTableOptions,
} from "./__mocks__/invalidTableData";
import {
  validCellPaddings,
  validMaxColumns,
  validMaxRows,
  validTableData,
  validTableOptions,
} from "./__mocks__/validTableData";

describe("checkTableOptionsAreValid", () => {
  it("should throw an error if optionChecks is set to 'error' and option arguments are invalid", () => {
    expect(() =>
      tableValidations.checkTableOptionsAreValid({
        optionChecks: "error",
        maxColWidths: -1,
      })
    ).toThrowError();
  });
  it("should log a warning if optionChecks is set to 'warn' and option arguments are invalid", () => {
    const warnMock = jest.spyOn(console, "warn").mockImplementation(() => {});

    tableValidations.checkTableOptionsAreValid({
      optionChecks: "warn",
      maxColWidths: -1,
    });

    expect(warnMock).toHaveBeenCalled();
    warnMock.mockRestore();
  });
  it("should not execute if optionChecks is set to 'skip' and option arguments are invalid", () => {
    const checkMock = jest
      .spyOn(tableValidations, "isValid")
      .mockImplementation(() => {});

    tableValidations.checkTableOptionsAreValid({
      optionChecks: "skip",
      maxColWidths: -1,
    });

    expect(checkMock).toHaveBeenCalledTimes(0);
    checkMock.mockRestore();
  });
  it("should throw an error if cellPadding option is invalid", () => {
    invalidCellPaddings.forEach((cellPadding: any) => {
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ cellPadding })
      ).toThrowError();
    });
  });
  it("should return true if cellPadding option is valid", () => {
    validCellPaddings.forEach((cellPadding: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        cellPadding,
      });
      expect(result).toBeTruthy();
    });
  });
  it("should throw an error if maxColumns option is invalid", () => {
    invalidMaxColumns.forEach((maxColumns: any) => {
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ maxColumns })
      ).toThrowError();
    });
  });
  it("should return true if maxColumns option is valid", () => {
    validMaxColumns.forEach((maxColumns: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        maxColumns,
      });
      expect(result).toBeTruthy();
    });
  });
  it("should throw an error if maxRows option is invalid", () => {
    invalidMaxRows.forEach((maxRows: any) => {
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ maxRows })
      ).toThrowError();
    });
  });
  it("should return true if maxRows option is valid", () => {
    validMaxRows.forEach((maxRows: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        maxRows,
      });
      expect(result).toBeTruthy();
    });
  });
  it("should throw an error if maxColWidths option is invalid", () => {
    invalidMaxColWidths.forEach((maxColWidths: any) => {
      console.log("maxColWidths: ", maxColWidths);
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ maxColWidths })
      ).toThrowError();
    });
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
