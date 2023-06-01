import { invalidTableData } from "./__mocks__/invalidTableData";
import { validTableData } from "./__mocks__/validTableData";
import { invalidTableOptions } from "./__mocks__/invalidTableOptions";
import { validTableOptions } from "./__mocks__/validTableOptions";

import { TABLE_DEFAULTS } from "../src/tableDefaults";
import { CustomBorders } from "../src//tableTypes";
import { VersitableFacade } from "../src//VersitableFacade";
import { Versitable } from "../src/Versitable";

const {
  horizontalLine,
  verticalLine,
  topLeftCorner,
  topRightCorner,
  bottomLeftCorner,
  bottomRightCorner,
} = (TABLE_DEFAULTS.borders as CustomBorders).glyphs;

describe("Versitable: ", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  describe("make: ", () => {
    it("should create a Versitable if passed in a string[][]", () => {
      const myVersitable = Versitable.make(validTableData);
      expect(myVersitable).toBeInstanceOf(VersitableFacade);
      expect(myVersitable[0]).toBeInstanceOf(Array);
      expect(typeof myVersitable.print).toBe("function");
      expect(typeof myVersitable[0][0]).toBe("string");
    });

    it("should error if not passed a table with type: string[][]", () => {
      for (const element of invalidTableData) {
        expect(() => Versitable.make(element)).toThrowError();
      }
    });

    it("should create a Versitable if passed in valid options", () => {
      const myVersitable = Versitable.make(validTableData, {
        ...validTableOptions,
      });
      expect(myVersitable).toBeInstanceOf(VersitableFacade);
      expect(myVersitable[0]).toBeInstanceOf(Array);
      expect(typeof myVersitable[0][0]).toBe("string");
    });

    it("should error if passed in invalid options", () => {
      for (const invalidOption of invalidTableOptions) {
        expect(() =>
          Versitable.make(validTableData, {
            ...validTableOptions,
            ...invalidOption,
          } as any)
        ).toThrowError();
      }
    });

    it("should create a header as the top row of the table if passed in a valid header option", () => {
      const myVersitable = Versitable.make(validTableData, {
        header: ["header1", "header2"],
        borders: false,
        maxRows: 10,
        maxRowHeight: 1,
        styles: false,
      });
      expect(myVersitable[0][0].trim()).toBe("header1");
      expect(myVersitable[0][1].trim()).toBe("header2");
    });

    it("should limit the rows created based on the maxRows option", () => {
      const myVersitable = Versitable.make(validTableData, {
        borders: false,
        maxRows: 10,
        maxRowHeight: 1,
      });
      expect(myVersitable.length).toBeLessThanOrEqual(10);
    });

    it("should limit the columns created based on the maxColumns option", () => {
      const myVersitable = Versitable.make(validTableData, {
        borders: false,
        maxColumns: 2,
      });
      expect(myVersitable[0].length).toBeLessThanOrEqual(2);
    });

    it("should truncate the cells based on the maxColWidths option", () => {
      const myVersitable = Versitable.make(validTableData, {
        borders: false,
        maxColWidths: 7,
        cellPadding: 0,
        styles: false,
      });
      expect(myVersitable[0][0].length).toBeLessThanOrEqual(7);
    });

    it("should create a border around the table if borders === true", () => {
      const myVersitable = Versitable.make(validTableData, {
        ...TABLE_DEFAULTS,
        borders: true,
        styles: false,
      });

      expect(myVersitable[0][0][0]).toBe(topLeftCorner);
      expect(myVersitable[0][myVersitable[0].length - 1][0]).toBe(
        topRightCorner
      );
      expect(myVersitable[myVersitable.length - 1][0][0]).toBe(
        bottomLeftCorner
      );
      expect(
        myVersitable[myVersitable.length - 1][myVersitable[0].length - 1][0]
      ).toBe(bottomRightCorner);
      expect(myVersitable[0][1][0]).toBe(horizontalLine);
      expect(myVersitable[1][0][0]).toBe(verticalLine);
    });

    it("should not create a border around the table if borders === false", () => {
      const myVersitable = Versitable.make(validTableData, {
        ...TABLE_DEFAULTS,
        borders: false,
      });
      expect(myVersitable[0][0][0]).not.toBe(topLeftCorner);
      expect(myVersitable[0][myVersitable[0].length - 1][0]).not.toBe(
        topRightCorner
      );
      expect(myVersitable[myVersitable.length - 1][0][0]).not.toBe(
        bottomLeftCorner
      );
      expect(
        myVersitable[myVersitable.length - 1][myVersitable[0].length - 1][0]
      ).not.toBe(bottomRightCorner);
      expect(myVersitable[0][1][0]).not.toBe(horizontalLine);
      expect(myVersitable[1][0][0]).not.toBe(verticalLine);
    });

    it("should not print borders between overflow rows (when betweenRows === true && maxRowHeight > 1 && cell content overflows", () => {
      const overFlowTableData = [
        ["this string is 63 characters long and will be split into 3 rows"],
        ["this string is 63 characters long and will be split into 3 rows"],
        ["this string is 63 characters long and will be split into 3 rows"],
      ];

      const myVersitable = Versitable.make(overFlowTableData, {
        ...TABLE_DEFAULTS,
        maxColWidths: 25,
        maxRowHeight: 3,
        borders: {
          positions: {
            left: false,
            right: false,
            top: false,
            bottom: false,
            betweenColumns: false,
            betweenRows: true,
          },
        },
        styles: false,
      });

      let borderRowCount = 0;
      for (let i = 0; i <= 3; i++) {
        // First row should not be a border row
        if (i === 0) {
          expect(myVersitable[i][0][0]).not.toBe(horizontalLine);
        } else if ((i + borderRowCount) % 3 === 0) {
          // The row after every third row should be a border row
          expect(myVersitable[i][0][0]).toBe(horizontalLine);
          borderRowCount++;
        } else {
          // All other rows should not be a border row
          expect(myVersitable[i][0][0]).not.toBe(horizontalLine);
        }
      }
    });
  });

  describe("getColByIdx: ", () => {
    it("should ", () => {});
  });
});
