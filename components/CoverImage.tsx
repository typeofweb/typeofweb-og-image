import marked from "marked";
import { getDefaultImages } from "../utils/parseRequest";
import { ImageProps } from "../utils/types";
import twemoji from 'twemoji';

const emojify = (text: string) => twemoji.parse(text, (icon) => {
  const img = icon.toLowerCase().split('-').filter(u => u !== 'fe0f' && u!=='fe0e').join('_');
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
  images = getDefaultImages(images);
  return (
    <div
      className={"overlay"}
      style={{
        backgroundImage: `url('http://${process.env.NEXT_PUBLIC_HOST}/og-cover-bg.png')`,
      }}
    >
      <div className={"cover"} style={{ backgroundColor: color }}>
        <div className={"spacer"} style={{ gap }}>
          <div className={"logoWrapper"}>
            {images.map((img, i) => (
              <img
                key={img + "_" + i}
                className={"logo"}
                alt="Generated Image"
                src={img}
                width={widths[i]}
                height={heights[i]}
              />
            ))}
          </div>
          <div
            className={"heading"}
            style={{ fontSize }}
            dangerouslySetInnerHTML={{ __html: emojify(marked(text)).trim() }}
          />
        </div>
      </div>
    </div>
  );
};
