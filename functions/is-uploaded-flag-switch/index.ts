import { S3Handler } from "aws-lambda";
import { validateImageName } from "./validators/images.validator";
import { updateIsUploadedByImageName } from "./gateways/image.gateway";

export const handler: S3Handler = async (event): Promise<void> => {
  const imageName = event.Records[0].s3.object.key;

  try {
    await validateImageName(imageName);
    await updateIsUploadedByImageName(imageName);
  } catch (error) {
    throw error;
  }
};
