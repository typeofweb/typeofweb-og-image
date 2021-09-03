import Document, { Html, Head, Main, NextScript } from "next/document";

import type { DocumentContext } from "next/document";
import { fontCss } from "../utils/fonts";
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }
  render() {
    return (
      <Html lang="pl-PL" dir="ltr">
        <Head>
          <link
            rel="stylesheet"
            href="https://cdn.simplecss.org/simple.min.css"
          />
          <style key="fonts" dangerouslySetInnerHTML={{ __html: fontCss }} />
        </Head>
        <body itemScope itemType="http://schema.org/WebPage">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
