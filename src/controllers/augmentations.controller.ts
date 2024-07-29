import { Request, Response } from "express";
import * as gateway from "../gateways/augmentations.gateway";
import Augmentation from "../database/models/augmentation";

export const createAugmentationsBatch = async (req: Request, res: Response) => {
  const payload: Augmentation[] = req.body.augmentations;
  const augmentations = await gateway.createAugmentationsBatch(payload);
  res.status(201).send(augmentations);
};

export const deleteAugmentationsBatch = async (req: Request, res: Response) => {
  await gateway.deleteAugmentationsBatch(req.body.ids);
  res.send();
};
