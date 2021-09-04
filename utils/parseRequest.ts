import { publicUrl } from "./constants";

export function getArray(
  stringOrArray: string[] | string | undefined
): string[] {
  if (typeof stringOrArray === "undefined") {
    return [];
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray;
  } else {
    return [stringOrArray];
  }
}

export function getString(
  stringOrArray: string[] | string | undefined
): string {
  if (typeof stringOrArray === "undefined") {
    return "";
  } else if (Array.isArray(stringOrArray)) {
    return stringOrArray.join(",");
  } else {
    return stringOrArray;
  }
}
