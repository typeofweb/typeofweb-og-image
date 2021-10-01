import { Cloudinary } from "cloudinary-core";

export const getCloudinaryUrl = (imageUrl: string) => {
  const cl = Cloudinary.new({ cloud_name: "type-of-web" });

  return cl.image(imageUrl, { type: "fetch" }).src;
};
