import Fs from 'fs';
import Path from 'path';

const mono = Fs.readFileSync(Path.join(process.cwd(), 'public', 'fonts', 'firamono-regular-typeofweb.woff2')).toString('base64');
const rglr = Fs.readFileSync(Path.join(process.cwd(), 'public', 'fonts', 'firasans-regular-typeofweb.woff2')).toString('base64');
const bold = Fs.readFileSync(Path.join(process.cwd(), 'public', 'fonts', 'firasans-semibold-typeofweb.woff2')).toString('base64');

export const fontCss = `
@font-face {
  font-family: 'Fira Sans';
  font-style:  normal;
  font-weight: normal;
  src: url(data:font/woff2;charset=utf-8;base64,${rglr}) format('woff2');
}

@font-face {
  font-family: 'Fira Sans';
  font-style:  normal;
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
