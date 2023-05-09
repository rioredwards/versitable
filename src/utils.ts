export function deepMerge<T>(obj1: T, obj2: Partial<T>): T {
  const result: any = {};

  for (const key in obj1) {
    // Loop through all properties in obj1
    if (Object.prototype.hasOwnProperty.call(obj1, key)) {
      // If the property is an object, but not an array,
      // And it's also an object in obj2, merge recursively
      if (
        typeof obj1[key] === "object" &&
        typeof obj2[key] === "object" &&
        !Array.isArray(obj1[key]) &&
        obj2[key] !== undefined
      ) {
        result[key] = deepMerge(
          obj1[key],
          obj2[key] as Partial<T[Extract<keyof T, string>]>
        );
      } else {
        result[key] = obj2[key] !== undefined ? obj2[key] : obj1[key];
      }
    }
  }

  return result as T;
}

export function insert2DArray(
  targetArray: any[],
  arrayToInsert: any[],
  index: number
) {
  for (let i = 0; i < arrayToInsert.length; i++) {
    targetArray.splice(index + i, 0, arrayToInsert[i]);
  }
}

export function insertIntoSortedArray(
  sortedArray: number[],
  insertVal: number
) {
  const index = sortedArray.findIndex((element) => element >= insertVal);
  if (index === -1) {
    // If findIndex() returns -1, it means that the insertVal is greater than all existing elements
    sortedArray.push(insertVal);
  } else {
    sortedArray.splice(index, 0, insertVal);
  }
}

export function splitStr(str: string, idx: number) {
  return [str.slice(0, idx), str.slice(idx)];
}
