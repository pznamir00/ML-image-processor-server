import Image from "../database/models/image";
import {
  checkImagesExistByIds,
  createImagesBatch,
  deleteImagesBatch,
  updateImagesBatch,
} from "./images.gateway";

let savedImages: Image[] = [];

describe("images gateway", () => {
  beforeEach(setup);
  afterEach(tearDown);

  describe("createImagesBatch", () => {
    it("creates batch images", async () => {
      const obj = {
        name: "img3.jpg",
        url: "bucket/images/img3.jpg",
        datasetId: 5,
        metadata: { class: "cls2" },
        isUploaded: false,
      };
      await createImagesBatch([obj as any]);
      const latestObj = await Image.findOne({
        order: [["id", "DESC"]],
      });
      expect(latestObj).toMatchObject(obj);
    });

    it("returns images", async () => {
      const obj = {
        name: "img3.jpg",
        url: "bucket/images/img3.jpg",
        datasetId: 5,
        metadata: { class: "cls2" },
        isUploaded: false,
      };
      const resp = await createImagesBatch([obj as any]);
      expect(resp).toEqual([expect.objectContaining(obj)]);
    });
  });

  describe("updateImagesBatch", () => {
    it("updates batch images", async () => {
      await updateImagesBatch(
        savedImages.map((i) => ({ ...i, name: "updated" })) as any
      );
      const objects = await Image.findAll();
      expect(objects).toHaveLength(2);
      expect(objects[0]).toHaveProperty("name", "updated");
      expect(objects[1]).toHaveProperty("name", "updated");
    });
  });

  describe("deleteImagesBatch", () => {
    it("deletes batch images", async () => {
      await deleteImagesBatch(savedImages.map((img) => img.id));
      const remainObjects = await Image.findAll();
      expect(remainObjects).toHaveLength(0);
    });
  });

  describe("checkImagesExistByIds", () => {
    it("returns array of not existing ids", async () => {
      const resp = await checkImagesExistByIds([-1, -2, savedImages[0].id]);
      expect(resp).toEqual([-1, -2]);
    });
  });
});

async function setup() {
  const images = await Image.bulkCreate([
    {
      name: "img1.jpg",
      url: "bucket/images/img1.jpg",
      datasetId: 5,
      metadata: { class: "cls1" },
      isUploaded: false,
    },
    {
      name: "img2.jpg",
      url: "bucket/images/img2.jpg",
      datasetId: 5,
      metadata: { class: "cls2" },
      isUploaded: false,
    },
  ]);
  savedImages = images.map((ds) => ds.toJSON());
}

async function tearDown() {
  await Image.truncate();
}
