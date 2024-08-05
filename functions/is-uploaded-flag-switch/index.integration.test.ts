import { Context, S3Event } from "aws-lambda";
import { handler } from "./index";
import Image from "../../src/database/models/image";

let savedImages: Image[] = [];

describe("isUploaded flag switch lambda", () => {
  beforeEach(setup);
  afterEach(tearDown);

  describe("handler", () => {
    it("updates image.isUploaded flag", async () => {
      const { event, context, callback } = setupParams("img1.jpg");
      await handler(event, context, callback);
      const obj = await Image.findOne({ where: { name: "img1.jpg" } });
      expect(obj?.isUploaded).toBe(true);
    });

    it("throws an error if image name is invalid", async () => {
      try {
        const { event, context, callback } = setupParams("img5.jpg");
        await handler(event, context, callback);
        throw new Error("Error should have been thrown");
      } catch (error: any) {
        expect(error.message).toEqual("Image with name img5.jpg doesn't exist");
      }
    });
  });
});

function setupParams(imageName: string) {
  return {
    context: {} as Context,
    callback: jest.fn(),
    event: {
      Records: [
        {
          s3: {
            bucket: { name: "s3-bucket-example" },
            object: { key: imageName },
          },
        },
      ],
    } as S3Event,
  };
}

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
