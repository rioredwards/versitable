import * as tableValidations from "../src/tableValidations";
import {
  invalidCellPaddings,
  invalidHeader,
  invalidMaxColWidths,
  invalidMaxColumns,
  invalidMaxRowHeight,
  invalidMaxRows,
  invalidTopAndBottomBorder,
} from "./__mocks__/invalidTableData";
import {
  validCellPaddings,
  validHeader,
  validMaxColWidths,
  validMaxColumns,
  validMaxRowHeight,
  validMaxRows,
  validTopAndBottomBorder,
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
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ maxColWidths })
      ).toThrowError();
    });
  });
  it("should return true if maxColWidths option is valid", () => {
    validMaxColWidths.forEach((maxColWidths: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        maxColWidths,
      });
      expect(result).toBeTruthy();
    });
  });
  it("should throw an error if maxRowHeight option is invalid", () => {
    invalidMaxRowHeight.forEach((maxRowHeight: any) => {
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ maxRowHeight })
      ).toThrowError();
    });
  });
  it("should return true if maxRowHeight option is valid", () => {
    validMaxRowHeight.forEach((maxRowHeight: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        maxRowHeight,
      });
      expect(result).toBeTruthy();
    });
  });
  it("should throw an error if topAndBottomBorder option is invalid", () => {
    invalidTopAndBottomBorder.forEach((topAndBottomBorder: any) => {
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ topAndBottomBorder })
      ).toThrowError();
    });
  });
  it("should return true if topAndBottomBorder option is valid", () => {
    validTopAndBottomBorder.forEach((topAndBottomBorder: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        topAndBottomBorder,
      });
      expect(result).toBeTruthy();
    });
  });
  it("should throw an error if header option is invalid", () => {
    invalidHeader.forEach((header: any) => {
      expect(() =>
        tableValidations.checkTableOptionsAreValid({ header })
      ).toThrowError();
    });
  });
  it("should return true if header option is valid", () => {
    validHeader.forEach((header: any) => {
      const result = tableValidations.checkTableOptionsAreValid({
        header,
      });
      expect(result).toBeTruthy();
    });
  });
});
