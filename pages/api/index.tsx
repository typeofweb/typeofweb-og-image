import { NextApiRequest, NextApiResponse } from "next";
import core from "puppeteer-core";
import { getArray, getString } from "../../utils/parseRequest";
import { FileType, ParsedRequest } from "../../utils/types";
import { renderToString } from "react-dom/server";
import Fs from "fs";
import Path from "path";
import { CoverImage } from "../../components/CoverImage";
import chrome from "chrome-aws-lambda";
const exePath =
  process.platform === "win32"
    ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
    : process.platform === "linux"
    ? "/usr/bin/google-chrome"
    : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const isDev = !process.env.AWS_REGION;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const parsedReq = parseRequest(req);
    const html = getHtml(parsedReq);
    const { fileType } = parsedReq;
    const file = await getScreenshot(html, fileType, isDev);
    res.statusCode = 200;
    res.setHeader("Content-Type", `image/${fileType}`);
    res.setHeader(
      "Cache-Control",
      `public, immutable, no-transform, s-maxage=31536000, max-age=31536000`
    );
    res.end(file);
  } catch (e) {
    res.statusCode = 500;
    res.setHeader("Content-Type", "text/html");
    res.end("<h1>Internal Error</h1><p>Sorry, there was a problem</p>");
    console.error(e);
  }
}

function getHtml({ fileType, ...props }: ParsedRequest) {
  const el = <CoverImage {...props} />;
  return renderToString(el);
}

function parseRequest(req: NextApiRequest): ParsedRequest {
  return {
    text: getString(req.query.text),
    images: getArray(req.query.images),
    widths: getArray(req.query.widths),
    heights: getArray(req.query.heights),
    fontSize: req.query.fontSize + "px",
    gap: req.query.gap + "px",
    overlayColor: getString(req.query.overlayColor),
    overlayOpacity: getString(req.query.overlayOpacity),
    fileType: "png",
  };
}

let mutablePage: core.Page | null;
async function getPage(isDev: boolean) {
  if (mutablePage) {
    return mutablePage;
  }

  const options = await getOptions(isDev);
  const browser = await core.launch(options);
  mutablePage = await browser.newPage();
  return mutablePage;
}

async function getScreenshot(html: string, type: FileType, isDev: boolean) {
  const page = await getPage(isDev);
  await page.setViewport({ width: 1200, height: 628 });
  await page.setContent(`
<!doctype html>
<base href="${process.env.NEXT_PUBLIC_HOST}" />
${html}
  `.trim());
  const appCss = Fs.readFileSync(Path.join(process.cwd(), "styles.css"), "utf-8");
  const coverImageCss = Fs.readFileSync(
    Path.join(process.cwd(), "coverImage.css"),
    "utf-8"
  );
  await page.addStyleTag({ content: appCss });
  await page.addStyleTag({ content: coverImageCss });
  const file = await page.screenshot({ type });
  return file;
}

async function getOptions(isDev: boolean) {
  if (isDev) {
    return {
      args: [],
      executablePath: exePath,
      headless: true,
    };
  } else {
    return {
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    };
  }
}
