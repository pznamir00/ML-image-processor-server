import { Request, Response } from "express";
import * as gateway from "../gateways/datasets.gateway";

export const listDatasets = async (_: Request, res: Response) => {
  const datasets = await gateway.findAllDatasets();
  res.send(datasets);
};

export const createDataset = async (req: Request, res: Response) => {
  const dataset = await gateway.createDataset(req.body);
  res.status(201).send(dataset);
};

export const retrieveDataset = async (req: Request, res: Response) => {
  const dataset = await gateway.findDatasetById(+req.params.id);
  res.send(dataset);
};

export const updateDataset = async (req: Request, res: Response) => {
  await gateway.updateDatasetById(+req.params.id, req.body);
  res.send();
};

export const deleteDataset = async (req: Request, res: Response) => {
  await gateway.deleteDatasetById(+req.params.id);
  res.send();
};
