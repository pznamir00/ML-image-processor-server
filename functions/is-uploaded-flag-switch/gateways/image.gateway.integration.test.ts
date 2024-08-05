import Image from "../../../src/database/models/image";
import {
  checkImageExistsByName,
  updateIsUploadedByImageName,
} from "./image.gateway";

let savedImages: Image[] = [];

describe("image gateway - integration", () => {
  beforeEach(setup);
  afterEach(tearDown);

  describe("checkImageExistsByName", () => {
    it("returns true if image exists", async () => {
      const exists = await checkImageExistsByName("img1.jpg");
      expect(exists).toBe(true);
    });

    it("returns true if image exists", async () => {
      const exists = await checkImageExistsByName("img5.jpg");
      expect(exists).toBe(false);
    });
  });

  describe("updateIsUploadedByImageName", () => {
    it("updates image.isUploaded", async () => {
      await updateIsUploadedByImageName("img1.jpg");
      const obj = await Image.findOne({ where: { name: "img1.jpg" } });
      expect(obj?.isUploaded).toBe(true);
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
