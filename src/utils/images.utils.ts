import Image from "../database/models/image";
import { v4 as uuidv4 } from "uuid";

const BUCKET = `${process.env.BUCKET}/images`;

export const setDefaultImageProps = (image: Image) => {
  image.name = `${uuidv4()}.jpg`;
  image.url = `${BUCKET}/${image.name}`;
  image.isUploaded = false;
  image.metadata = null;
};
