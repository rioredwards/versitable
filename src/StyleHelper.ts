import chalk = require("chalk");

// This class provides a variety of methods for parsing and manipulating color/chalk strings
export class StyleHelper {
  static convertRGBToComponents(color: string): number[] {
    const rgb = this.convertToRGBString(color);
    let rgbComponents: number[];

    rgbComponents = rgb
      .substring(4, rgb.length - 1)
      .split(",")
      .map((component) => parseInt(component.trim()));

    return rgbComponents;
  }

  static convertHexToRGBString(hex: string): string {
    if (hex.charAt(0) === "#") {
      hex = hex.substring(1);
    }
    // If the color is in shorthand form, convert it to full form
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }

    // Convert to RGB
    let r = parseInt(hex.slice(0, 2), 16);
    let g = parseInt(hex.slice(2, 4), 16);
    let b = parseInt(hex.slice(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  }

  static convertToRGBString(color: string): string {
    if (color.startsWith("rgb(")) return color;
    else if (color.startsWith("#")) {
      return this.convertHexToRGBString(color);
    } else if (namedColorToRgbMap.has(color as any)) {
      return namedColorToRgbMap.get(color as any)!;
    } else {
      throw new Error(`Invalid color format: ${color}`);
    }
  }

  static calcAvgColor(color1: string, color2: string): string {
    // Parse the color strings into RGB components
    const rgb1 = this.convertRGBToComponents(color1);
    const rgb2 = this.convertRGBToComponents(color2);

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
    let formattedModifier = modifier ? modifier : "";

    if (fgColor) {
      // Add dot separator if modifier is also present
      if (formattedModifier) formattedFgColor = `.${formattedFgColor}`;
    }
    if (bgColor) {
      // rgb(xxx, xxx, xxx) -> bgRgb(xxx,xxx,xxx)
      formattedBgColor = `bgR${formattedBgColor.substring(1)}`;
      // Add dot separator if fgColor is also present
      if (formattedFgColor) formattedBgColor = `.${formattedBgColor}`;
    }

    return chalk`{${formattedModifier}${formattedFgColor}${formattedBgColor} ${text}}`;
  }
}

const namedColorToRgbMap = new Map<chalkFgColors | chalkBgColors, string>([
  ["black", "rgb(0,0,0)"],
  ["red", "rgb(182, 37, 37)"],
  ["green", "rgb(38, 177, 38)"],
  ["yellow", "rgb(190, 190, 37)"],
  ["blue", "rgb(34, 34, 198)"],
  ["magenta", "rgb(180, 36, 180)"],
  ["cyan", "rgb(38, 192, 192)"],
  ["white", "rgb(219, 219, 219)"],
  ["gray", "rgb(128, 128, 128)"],
  ["grey", "rgb(128, 128, 128)"],
  ["blackBright", "rgb(66, 66, 66)"],
  ["redBright", "rgb(255, 0, 0)"],
  ["greenBright", "rgb(0, 255, 0)"],
  ["yellowBright", "rgb(255, 255, 0)"],
  ["blueBright", "rgb(0, 0, 255)"],
  ["magentaBright", "rgb(255, 0, 255)"],
  ["cyanBright", "rgb(0, 255, 255)"],
  ["whiteBright", "rgb(255, 255, 255)"],
  ["bgBlack", "rgb(0,0,0)"],
  ["bgRed", "rgb(182, 37, 37)"],
  ["bgGreen", "rgb(38, 177, 38)"],
  ["bgYellow", "rgb(190, 190, 37)"],
  ["bgBlue", "rgb(34, 34, 198)"],
  ["bgMagenta", "rgb(180, 36, 180)"],
  ["bgCyan", "rgb(38, 192, 192)"],
  ["bgWhite", "rgb(219, 219, 219)"],
  ["bgGray", "rgb(128, 128, 128)"],
  ["bgGrey", "rgb(128, 128, 128)"],
  ["bgBlackBright", "rgb(66, 66, 66)"],
  ["bgRedBright", "rgb(255, 0, 0)"],
  ["bgGreenBright", "rgb(0, 255, 0)"],
  ["bgYellowBright", "rgb(255, 255, 0)"],
  ["bgBlueBright", "rgb(0, 0, 255)"],
  ["bgMagentaBright", "rgb(255, 0, 255)"],
  ["bgCyanBright", "rgb(0, 255, 255)"],
  ["bgWhiteBright", "rgb(255, 255, 255)"],
]);

export type chalkFgColors =
  | "black"
  | "red"
  | "green"
  | "yellow"
  | "blue"
  | "magenta"
  | "cyan"
  | "white"
  | "gray"
  | "grey"
  | "blackBright"
  | "redBright"
  | "greenBright"
  | "yellowBright"
  | "blueBright"
  | "magentaBright"
  | "cyanBright"
  | "whiteBright";

export type chalkBgColors =
  | "bgBlack"
  | "bgRed"
  | "bgGreen"
  | "bgYellow"
  | "bgBlue"
  | "bgMagenta"
  | "bgCyan"
  | "bgWhite"
  | "bgGray"
  | "bgGrey"
  | "bgBlackBright"
  | "bgRedBright"
  | "bgGreenBright"
  | "bgYellowBright"
  | "bgBlueBright"
  | "bgMagentaBright"
  | "bgCyanBright"
  | "bgWhiteBright";

export type chalkModifiers =
  | "reset"
  | "bold"
  | "dim"
  | "italic"
  | "underline"
  | "inverse"
  | "hidden"
  | "strikethrough"
  | "visible";
