import { PartialTableOptions, TargetCellStyle } from "../../src/tableTypes";

const topLeft = { row: 0, column: 0 };
const topRight = { row: 0, column: 99 };
const bottomLeft = { row: 48, column: 0 };
const bottomRight = { row: 48, column: 99 };

// const versitableTextTopBoundaries = () => {
//   let tiles: TargetCellStyle[] = [];
//   const boundingBox = multiTileGenerator(5, 12, 24, 32, "#447c65");
//   const v = [
//     multiTileGenerator(5, 5, 24, 24, "#9a4e26"),
//     multiTileGenerator(6, 6, 24, 24, "#9a4e26"),
//     multiTileGenerator(7, 7, 25, 25, "#9a4e26"),
//     multiTileGenerator(8, 8, 25, 25, "#9a4e26"),
//     multiTileGenerator(9, 9, 26, 26, "#9a4e26"),
//     multiTileGenerator(10, 10, 26, 26, "#9a4e26"),
//     multiTileGenerator(11, 11, 27, 27, "#9a4e26"),
//     multiTileGenerator(12, 12, 27, 27, "#9a4e26"),
//     multiTileGenerator(13, 13, 28, 28, "#9a4e26"),
//   ] as TargetCellStyle[][];

//   tiles.push(...boundingBox, ...v.flat());
//   return tiles;
// };

const versitableText = () => {
  let tiles: TargetCellStyle[] = [];
  const v = [
    singleTileGenerator(5, 24, "#9a4e26").flat(),
    singleTileGenerator(6, 24, "#9a4e26").flat(),
    singleTileGenerator(7, 25, "#9a4e26").flat(),
    singleTileGenerator(8, 25, "#9a4e26").flat(),
    singleTileGenerator(9, 26, "#9a4e26").flat(),
    singleTileGenerator(10, 26, "#9a4e26").flat(),
    singleTileGenerator(11, 27, "#9a4e26").flat(),
    singleTileGenerator(12, 27, "#9a4e26").flat(),
    singleTileGenerator(12, 28, "#9a4e26").flat(),
    singleTileGenerator(11, 28, "#9a4e26").flat(),
    singleTileGenerator(10, 29, "#9a4e26").flat(),
    singleTileGenerator(9, 29, "#9a4e26").flat(),
    singleTileGenerator(8, 30, "#9a4e26").flat(),
    singleTileGenerator(7, 30, "#9a4e26").flat(),
    singleTileGenerator(6, 31, "#9a4e26").flat(),
    singleTileGenerator(5, 31, "#9a4e26").flat(),
  ] as TargetCellStyle[][];

  const e = [
    ...multiTileGenerator(5, 12, 34, 34, "#9a4e26"),
    ...multiTileGenerator(5, 5, 35, 38, "#9a4e26"),
    ...multiTileGenerator(8, 8, 35, 38, "#9a4e26"),
    ...multiTileGenerator(12, 12, 35, 38, "#9a4e26"),
  ] as TargetCellStyle[];

  const r = [
    ...multiTileGenerator(5, 12, 42, 42, "#9a4e26"),
    ...multiTileGenerator(5, 5, 43, 46, "#9a4e26"),
    ...multiTileGenerator(5, 7, 46, 46, "#9a4e26"),
    ...multiTileGenerator(8, 8, 43, 45, "#9a4e26"),
    ...singleTileGenerator(8, 45, "#9a4e26").flat(),
    ...singleTileGenerator(9, 46, "#9a4e26").flat(),
    ...singleTileGenerator(10, 46, "#9a4e26").flat(),
    ...singleTileGenerator(11, 46, "#9a4e26").flat(),
    ...singleTileGenerator(12, 46, "#9a4e26").flat(),
  ] as TargetCellStyle[];

  const s = [
    ...multiTileGenerator(5, 5, 50, 54, "#9a4e26"),
    ...multiTileGenerator(5, 8, 50, 50, "#9a4e26"),
    ...multiTileGenerator(8, 8, 50, 54, "#9a4e26"),
    ...multiTileGenerator(9, 12, 54, 54, "#9a4e26"),
    ...multiTileGenerator(12, 12, 50, 54, "#9a4e26"),
  ] as TargetCellStyle[];

  const i = [
    ...multiTileGenerator(5, 12, 57, 57, "#9a4e26"),
  ] as TargetCellStyle[];

  tiles.push(...v.flat(), ...e, ...r, ...s, ...i);
  return tiles;
};

export const versitableDrawing: TargetCellStyle[] = [
  { bgColor: "#447c65", ...topLeft },
  { bgColor: "#447c65", ...bottomLeft },
  { bgColor: "#447c65", ...topRight },
  { bgColor: "#447c65", ...bottomRight },
  { bgColor: "#447c65", ...bottomRight },
  ...versitableText(),
];

function multiTileGenerator(
  startRow: number,
  endRow: number,
  startColumn: number,
  endColumn: number,
  bgColor: string
): TargetCellStyle[] {
  const tiles: TargetCellStyle[] = [];
  for (let row = startRow; row <= endRow; row++) {
    for (let column = startColumn; column <= endColumn; column++) {
      tiles.push({ bgColor, row, column });
    }
  }
  return tiles;
}

function singleTileGenerator(
  row: number,
  column: number,
  bgColor: string
): TargetCellStyle[] {
  return [{ bgColor, row, column }];
}

export const canvasOptions: PartialTableOptions = {
  maxRows: 49,
  maxColumns: 100,
  maxColWidths: [12, 18, 10],
  maxRowHeight: 1,
  cellPadding: 1,
  borders: {
    sides: {
      betweenRows: false,
      betweenColumns: false,
      top: false,
      bottom: false,
      left: false,
      right: false,
    },
    glyphs: {
      horizontalLine: " ",
      verticalLine: " ",
      topLeftCorner: " ",
      topRightCorner: " ",
      bottomLeftCorner: " ",
      bottomRightCorner: " ",
      topSeparator: " ",
      bottomSeparator: " ",
      middleSeparator: " ",
      rightSeparator: " ",
      leftSeparator: " ",
    },
  },
  styles: {
    rowStyles: [{ bgColor: "#525252" }],
    targetCellStyles: versitableDrawing,
  },
};
