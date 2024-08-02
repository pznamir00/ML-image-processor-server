import { S3Handler } from "aws-lambda";
import isTen from "is-ten";

export const handler: S3Handler = async (event): Promise<void> => {
  const bucket = event.Records[0].s3.bucket.name;
  const key = event.Records[0].s3.object.key;

  try {
    console.log(bucket, key);
    console.log(isTen(10), isTen(1000));
  } catch (error) {
    throw error;
  }
};
