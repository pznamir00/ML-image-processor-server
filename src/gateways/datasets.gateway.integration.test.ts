import Dataset from "../database/models/dataset";
import {
  checkDatasetExistsById,
  createDataset,
  deleteDatasetById,
  findAllDatasets,
  findDatasetById,
  updateDatasetById,
} from "./datasets.gateway";
import { DatasetTypes } from "../types/dataset-types.enum";

let savedDatasets: Dataset[] = [];

describe("datasets gateway", () => {
  beforeEach(setup);
  afterEach(tearDown);

  describe("findAllDatasets", () => {
    it("returns all datasets", async () => {
      const datasets = await findAllDatasets();
      expect(datasets).toHaveLength(2);
    });
  });

  describe("checkDatasetExistsById", () => {
    it("returns true if id exists in db", async () => {
      const exists = await checkDatasetExistsById(savedDatasets[0].id);
      expect(exists).toBe(true);
    });

    it("returns false if id does not exist in db", async () => {
      const exists = await checkDatasetExistsById(100);
      expect(exists).toBe(false);
    });
  });

  describe("findDatasetById", () => {
    it("returns object if id exists in db", async () => {
      const resp = await findDatasetById(savedDatasets[0].id);
      expect(resp).toEqual(expect.objectContaining(savedDatasets[0]));
    });

    it("returns null if id does not exist in db", async () => {
      const resp = await findDatasetById(-1);
      expect(resp).toBeNull();
    });
  });

  describe("createDataset", () => {
    it("creates an object", async () => {
      const obj = {
        name: "new dataset",
        type: DatasetTypes.CLASSIFICATION,
      } as unknown as Dataset;
      await createDataset(obj);
      const latestObj = await Dataset.findOne({
        order: [["id", "DESC"]],
      });
      expect(latestObj?.toJSON()).toEqual(expect.objectContaining(obj));
    });

    it("returns created object", async () => {
      const obj = {
        name: "new dataset",
        type: DatasetTypes.CLASSIFICATION,
      } as unknown as Dataset;
      const resp = await createDataset(obj);
      expect(resp).toEqual(expect.objectContaining(obj));
    });
  });

  describe("updateDatasetById", () => {
    it("updates an object", async () => {
      //@ts-ignore
      await updateDatasetById(savedDatasets[0].id, {
        ...savedDatasets[0],
        name: "updated",
      });
      const obj = await Dataset.findByPk(savedDatasets[0].id);
      expect(obj?.toJSON().name).toEqual("updated");
    });
  });

  describe("deleteDatasetById", () => {
    it("deletes an object", async () => {
      await deleteDatasetById(savedDatasets[0].id);
      const obj = await Dataset.findByPk(savedDatasets[0].id);
      expect(obj).toBeNull();
    });
  });
});

async function setup() {
  const datasets = await Dataset.bulkCreate([
    { name: "clothing", type: DatasetTypes.OBJECT_DETECTION },
    { name: "cat or dog", type: DatasetTypes.CLASSIFICATION },
  ]);
  savedDatasets = datasets.map((ds) => ds.toJSON());
}

async function tearDown() {
  await Dataset.truncate();
}
