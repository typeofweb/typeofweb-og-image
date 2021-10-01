import { useRouter } from "next/dist/client/router";
import { createElement, useEffect, useRef, useState } from "react";
import { CoverImage } from "../components/CoverImage";
import { publicUrl } from "../utils/constants";
import { getArray } from "../utils/parseRequest";
import { getCloudinaryUrl } from "../utils/saveToCloudinary";

type InputProps = Omit<JSX.IntrinsicElements["input"], "onInput"> & {
  onInput(value: string): void;
  label: string;
  as?: "input" | "textarea";
};

const Input = ({ label, onInput, as = "input", ...props }: InputProps) => {
  const El = createElement(as, {
    ...props,
    onInput: (e) => onInput(e.currentTarget.value),
  });
  return (
    <label>
      {label}
      {El}
    </label>
  );
};

const useUrlState = <T extends string | string[]>(
  name: string,
  defaultValue: T
): [T, (val: T) => void] => {
  const isArray = Array.isArray(defaultValue);
  const cast = (v: string | string[]) => (isArray ? getArray(v) : v);

  const router = useRouter();
  const state = cast(router.query[name] || defaultValue);

  useEffect(() => {
    setCachedState(cast(router.query[name] || defaultValue));
  }, [router.query[name]]);
  const [cachedState, setCachedState] = useState(state);
  const updateRouter = (val: T) => {
    router.replace(
      {
        query: {
          ...router.query,
          [name]: val,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };
  const setState = (val: T) => {
    setCachedState(cast(val));
    updateRouter(val);
  };
  return [cast(cachedState) as T, setState];
};

const predefinedColors = [
  { name: "Szarawy", color: "000000", opacity: "0.35" },
  { name: "TypeScript", color: "0070BC", opacity: "0.60" },
  { name: "Wpisy", color: "291B4A", opacity: "0.60" },
  { name: "MongoDB", color: "227F59", opacity: "0.20" },
  { name: "Hooki", color: "1C0202", opacity: "0.35" },
];

const encode = (str: string): string => {
  return str;
};
const decode = (str: string): string => {
  return str;
};

export default function Home() {
  const [didRender, setDidRender] = useState(false);

  const [text, setText] = useUrlState<string>("text", "");
  const [fontSize, setFontSize] = useUrlState<string>("fontSize", "100");
  const [gap, setGap] = useUrlState<string>("gap", "100");
  const [images, setImages] = useUrlState<string[]>("images", []);
  const [widths, setWidths] = useUrlState<string[]>("widths", []);
  const [heights, setHeights] = useUrlState<string[]>("heights", []);
  const [overlayColor, setOverlayColor] = useUrlState<string>(
    "overlayColor",
    "000000"
  );
  const [overlayOpacity, setOverlayOpacity] = useUrlState<string>(
    "overlayOpacity",
    "0.45"
  );

  useEffect(() => {
    setDidRender(true);
  }, []);

  const router = useRouter();

  if (!didRender) {
    return null;
  }

  const urlToImage = `${publicUrl}/api${location.search}`;

  return (
    <div className="container">
      <section>
        <Input
          as="textarea"
          label="Tekst"
          value={decode(text)}
          onInput={(t) => setText(encode(t))}
        />
        {images.map((image, i) => {
          return (
            <div key={i}>
              <Input
                as="input"
                label={`$${i + 1}`}
                type="url"
                value={image}
                onInput={(v) => {
                  const newImages = [...images];
                  newImages[i] = v;
                  setImages(newImages);
                }}
              />
              <Input
                as="input"
                label={`width $${i + 1}`}
                type="number"
                step={1}
                value={widths[i] || "200"}
                onInput={(v) => {
                  const newWidths = [...widths];
                  newWidths[i] = v;
                  setWidths(newWidths);
                }}
              />
              <button
                type="button"
                onClick={() => {
                  setImages(images.slice(0, i).concat(images.slice(i + 1)));
                  // setWidths(widths.slice(0, i).concat(widths.slice(i + 1)));
                }}
              >
                Usuń {i + 1}
              </button>
            </div>
          );
        })}
        <button
          type="button"
          onClick={() => {
            setImages([...images, "URL"]);
            // setWidths([...widths, "200"])
          }}
        >
          Dodaj obrazek
        </button>
        <Input
          as="input"
          label="Font Size"
          type="number"
          step="1"
          value={fontSize}
          onInput={setFontSize}
        />
        <Input
          as="input"
          label="Gap"
          type="number"
          step="1"
          value={gap}
          onInput={setGap}
        />
        <Input
          as="input"
          label={`Overlay Color ${overlayColor}`}
          type="color"
          step="1"
          value={"#" + overlayColor}
          onInput={(c) => setOverlayColor(c.replace("#", ""))}
          style={{ opacity: overlayOpacity }}
        />
        <Input
          as="input"
          label={`Overlay Opacity ${overlayOpacity}`}
          type="range"
          step="0.01"
          min="0"
          max="1"
          value={overlayOpacity}
          onInput={setOverlayOpacity}
        />
        <div>
          {predefinedColors.map(({ name, color, opacity }) => (
            <button
              key={color + opacity}
              type="button"
              onClick={() => {
                router.replace(
                  {
                    query: {
                      ...router.query,
                      overlayColor: color,
                      overlayOpacity: opacity,
                    },
                  },
                  undefined,
                  {
                    shallow: true,
                    scroll: false,
                  }
                );
              }}
            >
              {name}
            </button>
          ))}
        </div>
        <a href={urlToImage} target="_blank" rel="noreferrer">
          Otwórz plik
        </a>{" "}
        {/* <a href={getCloudinaryUrl(urlToImage)} target="_blank" rel="noreferrer">
          Otwórz Cloudinary
        </a> */}
      </section>
      <section className="result">
        <CoverImage
          text={decode(text)}
          images={getArray(images)}
          widths={getArray(widths)}
          heights={getArray(heights)}
          fontSize={fontSize + "px"}
          gap={gap + "px"}
          overlayColor={"#" + overlayColor}
          overlayOpacity={overlayOpacity}
        />
      </section>
    </div>
  );
}
