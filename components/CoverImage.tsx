import marked from "marked";
import { getDefaultImages } from "../utils/parseRequest";
import { ImageProps } from "../utils/types";
import twemoji from "twemoji";
import { publicUrl } from "../utils/constants";

const emojify = (text: string) =>
  twemoji.parse(text, (icon) => {
    const img = icon
      .toLowerCase()
      .split("-")
      .filter((u) => u !== "fe0f" && u !== "fe0e")
      .join("_");
    return `https://github.com/typeofweb/apple-emoji-linux/raw/master/png/128/emoji_u${img}.png`;
  });

export const CoverImage = ({
  images,
  widths,
  heights,
  text,
  fontSize,
  overlayColor,
  overlayOpacity,
  gap = "0px",
}: ImageProps) => {
  const opacity = ((Number(overlayOpacity) * 255) | 0).toString(16);
  const color = overlayColor + opacity;
  const logo = `${publicUrl}/typeofweb-logo-white.svg`;

  const html = emojify(marked(text)).trim();
  const output = addImages(html, images, widths);

  return (
    <div
      className={"overlay"}
      style={{
        backgroundImage: `url('${publicUrl}/og-cover-bg.png')`,
      }}
    >
      <div className={"cover"} style={{ backgroundColor: color }}>
        <div className={"spacer"} style={{ gap }}>
          <div className={"logoWrapper"}>
            <img className={"logo"} alt="" src={logo} />
          </div>
          <div
            className={"heading"}
            style={{ fontSize }}
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </div>
    </div>
  );
};

const PATTERN = /\$(\d+)/g;
function addImages(html: string, images: string[], widths: string[]): string {
  console.log(html);
  return html.replace(PATTERN, (_, match) => {
    const idx = match-1;
    return `<img alt="" src="${images[idx]}" width="${widths[idx] || 200}px" />`
  });
}
