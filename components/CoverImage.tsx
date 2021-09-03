import marked from "marked";
import { getDefaultImages } from "../utils/parseRequest";
import { ImageProps } from "../utils/types";

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
            dangerouslySetInnerHTML={{ __html: marked(text).trim() }}
          />
        </div>
      </div>
    </div>
  );
};
