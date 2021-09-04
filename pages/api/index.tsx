import { NextApiRequest, NextApiResponse } from "next";
import chrome from "chrome-aws-lambda";
import puppeteer from "puppeteer-core";
import { getArray, getString } from "../../utils/parseRequest";
import { ParsedRequest } from "../../utils/types";
import { renderToString } from "react-dom/server";
import { CoverImage } from "../../components/CoverImage";
import { publicUrl } from "../../utils/constants";
import { fontCss } from "../../utils/fonts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const parsedReq = parseRequest(req);
    const appCssUrl = `${publicUrl}/styles.css`;
    const coverImageCssUrl = `${publicUrl}/coverImage.css`;

    const [appCss, coverImageCss] = await Promise.all([
      fetch(appCssUrl).then((r) => r.text()),
      fetch(coverImageCssUrl).then((r) => r.text()),
    ]);

    const html = `
<!doctype html>
<base href="${process.env.NEXT_PUBLIC_HOST}" />
<style>${appCss}</style>
<style>${coverImageCss}</style>
<style>${await fontCss()}</style>
${getHtml(parsedReq)}
      `.trim();

      // res.setHeader("Content-Type", "text/html");
      // res.end(html);

    const file = await getScreenshot(html);
    res.statusCode = 200;
    res.setHeader("Content-Type", `image/png`);
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

function getHtml(props: ParsedRequest) {
  return renderToString(<CoverImage {...props} />);
}

function parseRequest(req: NextApiRequest): ParsedRequest {
  return {
    text: getString(req.query.text),
    images: getArray(req.query.images),
    widths: getArray(req.query.widths),
    heights: getArray(req.query.heights),
    fontSize: (req.query.fontSize || 100) + "px",
    gap: (req.query.gap || 100) + "px",
    overlayColor: getString(req.query.overlayColor),
    overlayOpacity: getString(req.query.overlayOpacity),
  };
}

async function getBrowser() {
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === "win32"
            ? "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
            : process.platform === "linux"
            ? "/usr/bin/google-chrome"
            : "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      };
  const browser = await puppeteer.launch(options);
  return browser;
}

async function getScreenshot(html: string) {
  const browser = await getBrowser();
  try {
    const page = await browser.newPage();
    const ratio = 1200 / 628;
    await page.setViewport({ width: 1920, height: 1920 / ratio | 0 });
    await page.setContent(html);

    const file = await page.screenshot({ type: "png" });
    return file;
  } finally {
    browser.close();
  }
}
