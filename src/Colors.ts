// import chalk = require("chalk");
// import { Chalk } from "chalk";

// function parseColorString(color: string): number[] {
//   let rgbComponents: number[];

//   // Check if the color is in hex format (#RRGGBB)
//   if (color.startsWith("#")) {
//     const hex = color.substring(1);
//     rgbComponents = [
//       parseInt(hex.substring(0, 2), 16), // Red component
//       parseInt(hex.substring(2, 4), 16), // Green component
//       parseInt(hex.substring(4, 6), 16), // Blue component
//     ];
//   }
//   // Check if the color is in RGB format (rgb(r, g, b))
//   else if (color.startsWith("rgb(")) {
//     rgbComponents = color
//       .substring(4, color.length - 1)
//       .split(",")
//       .map((component) => parseInt(component.trim()));
//   }
//   // Check if the color is a Chalk keyword color
//   else if (color in chalk.keyword) {
//     const chalkColor = chalk.keyword(color);
//     rgbComponents = parseColorString(chalkColor);
//   }
//   // Invalid color format
//   else {
//     throw new Error(`Invalid color format: ${color}`);
//   }

//   return rgbComponents;
// }
