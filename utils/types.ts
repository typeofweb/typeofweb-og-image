export type FileType = "png" | "jpeg";

export interface ParsedRequest extends ImageProps {
  fileType: FileType;
}

export interface ImageProps {
  text: string;
  images: string[];
  widths: string[];
  heights: string[];
  fontSize: string;
  overlayColor: string;
  overlayOpacity: string;
  gap: string;
}
