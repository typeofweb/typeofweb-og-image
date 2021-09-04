import Fs from "fs";
import Path from "path";
import { publicUrl } from "./constants";

async function blobToBase64Async(buffer: ArrayBuffer): Promise<string> {
  // return new Promise((resolve, reject) => {
  //   const fileReader = new FileReader();
  //   fileReader.onerror = () => reject(fileReader.error);
  //   fileReader.onloadend = () => resolve(fileReader.result as string);
  //   fileReader.readAsDataURL(blob);
  // });
  return Buffer.from(buffer).toString('base64');
}

export const fontCss = async () => {
  const [mono, rglr, bold] = await Promise.all([
    fetch(`${publicUrl}/fonts/firamono-regular-typeofweb.woff2`)
      .then((r) => r.arrayBuffer())
      .then(blobToBase64Async),
    fetch(`${publicUrl}/fonts/firasans-regular-typeofweb.woff2`)
      .then((r) => r.arrayBuffer())
      .then(blobToBase64Async),
    fetch(`${publicUrl}/fonts/firasans-semibold-typeofweb.woff2`)
      .then((r) => r.arrayBuffer())
      .then(blobToBase64Async),
  ]);

  return `
@font-face {
  font-family: 'Fira Sans';
  font-style: normal;
  font-weight: normal;
  src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
}

@font-face {
  font-family: 'Fira Sans';
  font-style: normal;
  font-weight: bold;
  src: url(data:font/woff2;charset=utf-8;base64,${bold}) format('woff2');
}

@font-face {
  font-family: 'Fira Mono';
  font-style: normal;
  font-weight: normal;
  src: url(data:font/woff2;charset=utf-8;base64,${mono}) format("woff2");
}
`;
};
