import { useRouter } from "next/dist/client/router";
import { createElement, useEffect, useRef, useState } from "react";
import { CoverImage } from "../components/CoverImage";
import { getArray } from "../utils/parseRequest";

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
  const router = useRouter();
  const state = router.query[name] || defaultValue;

  useEffect(() => {
    setCachedState(router.query[name] || defaultValue);
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
    setCachedState(val);
    updateRouter(val);
  };
  return [cachedState as T, setState];
};

const predefinedColors = [
  { name: "Szarawy", color: "#000000", opacity: "0.35" },
  { name: "TypeScript", color: "#0070BC", opacity: "0.60" },
  { name: "Wpisy", color: "#291B4A", opacity: "0.60" },
  { name: "MongoDB", color: "#227F59", opacity: "0.20" },
  { name: "Hooki", color: "#1C0202", opacity: "0.35" },
];

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
    "#000000"
  );
  const [overlayOpacity, setOverlayOpacity] = useUrlState<string>(
    "overlayOpacity",
    "0.45"
  );

  useEffect(() => {
    setDidRender(true);
  }, [])

  const router = useRouter();

  if (!didRender) {
    return null;
  }

  return (
    <div>
      <section>
        <Input as="textarea" label="Tekst" value={text} onInput={setText} />
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
          value={overlayColor}
          onInput={setOverlayColor}
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
      </section>
      <section className="result">
        <a href={`/api${router.asPath}`} target="_blank" rel="noreferrer">
        <CoverImage
          text={text}
          images={getArray(images)}
          widths={getArray(widths)}
          heights={getArray(heights)}
          fontSize={fontSize + "px"}
          gap={gap+"px"}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
        />
        </a>
      </section>
    </div>
  );
}
