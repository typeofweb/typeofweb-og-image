import { ParsedRequest } from "./types";
import { parse } from "url";
import { NextApiRequest } from "next";

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

export function getDefaultImages(images: string[]): string[] {
  const defaultImage = `http://${process.env.NEXT_PUBLIC_HOST}/typeofweb-logo-white.svg`;

  if (!images?.[0]) {
    return [defaultImage];
  }
  return images;
}
