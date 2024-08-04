import { Context, S3Event } from "aws-lambda";
import { handler } from "./index";

describe("isUploaded flag switch lambda", () => {
  describe("handler", () => {
    it("passes", async () => {
      const { event, context, callback } = setupParams();
      await handler(event, context, callback);
    });
  });
});

function setupParams() {
  return {
    context: {} as Context,
    callback: jest.fn(),
    event: {
      Records: [
        {
          s3: {
            bucket: { name: "s3-bucket-example" },
            object: { key: "photo.jpg" },
          },
        },
      ],
    } as S3Event,
  };
}
