import chalk = require("chalk");
import { Chalk } from "chalk";

// This class provides a variety of methods for parsing and manipulating color strings
export class ColorHelper {
  static convertToRGBComponents(color: string): number[] {
    let rgbComponents: number[];

    // Check if the color is in hex format (#RRGGBB)
    if (color.startsWith("#")) {
      const hex = color.substring(1);
      rgbComponents = [
        parseInt(hex.substring(0, 2), 16), // Red component
        parseInt(hex.substring(2, 4), 16), // Green component
        parseInt(hex.substring(4, 6), 16), // Blue component
      ];
    }
    // Check if the color is in RGB format (rgb(r, g, b))
    else if (color.startsWith("rgb(")) {
      rgbComponents = color
        .substring(4, color.length - 1)
        .split(",")
        .map((component) => parseInt(component.trim()));
    }
    // Invalid color format
    else {
      throw new Error(`Invalid color format: ${color}`);
    }

    return rgbComponents;
  }

  static convertToRGBString(color: string): string {
    if (color.startsWith("rgb(")) return color;
    const rgbComponents = this.convertToRGBComponents(color);
    const rgbString = `rgb(${rgbComponents.join(",")})`;
    return rgbString;
  }

  static calcAvgColor(color1: string, color2: string): string {
    // Parse the color strings into RGB components
    const rgb1 = this.convertToRGBComponents(color1);
    const rgb2 = this.convertToRGBComponents(color2);

    // Calculate the average RGB values
    const averageRGB = [
      Math.round((rgb1[0] + rgb2[0]) / 2), // Red component
      Math.round((rgb1[1] + rgb2[1]) / 2), // Green component
      Math.round((rgb1[2] + rgb2[2]) / 2), // Blue component
    ];

    // Convert the average RGB values back to a color string
    const averageColor = `rgb(${averageRGB.join(",")})`;

    return averageColor;
  }

  static createStyledString(
    text: string,
    fgColor?: string,
    bgColor?: string,
    modifier?: string
  ): string {
    let formattedFgColor = fgColor ? this.convertToRGBString(fgColor) : "";
    let formattedBgColor = bgColor ? this.convertToRGBString(bgColor) : "";
    let formattedModifier = "";

    if (bgColor) {
      // rgb(xxx, xxx, xxx) -> bgRgb(xxx,xxx,xxx)
      formattedBgColor = `bgR${formattedBgColor.substring(1)}`;
      // Add dot separator if fgColor is also present
      if (formattedFgColor) formattedBgColor = `.${formattedBgColor}`;
    }
    if (modifier) {
      // Add dot separator if fgColor is also present
      if (formattedFgColor || formattedModifier)
        formattedModifier = `.${formattedModifier}`;
    }
    return chalk`{${formattedFgColor}${formattedBgColor}${formattedModifier} ${text}}`;
  }
}
