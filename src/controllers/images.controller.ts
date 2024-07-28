import { Request, Response } from "express";
import * as gateway from "../gateways/images.gateway";
import Image from "../database/models/image";
import { setDefaultImageProps } from "../utils/images.utils";

export const createImagesBatch = async (req: Request, res: Response) => {
  const payload = req.body.images as Image[];
  payload.forEach(setDefaultImageProps);
  const images = await gateway.createImagesBatch(payload);
  res.status(201).send(images);
};

export const updateImagesBatch = async (req: Request, res: Response) => {
  await gateway.updateImagesBatch(req.body.images);
  res.send();
};

export const deleteImagesBatch = async (req: Request, res: Response) => {
  await gateway.deleteImagesBatch(req.body.ids);
  res.send();
};
