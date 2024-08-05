import { connect as connectDB } from "../database/connection";

export const checkImageExistsByName = async function (name: string) {
  const db = connectDB();
  const rows = await db.query(
    `SELECT 1 FROM "Images" WHERE "name"='${name}' LIMIT 1`,
  );
  return !!rows[0].length;
};

export const updateIsUploadedByImageName = async function (name: string) {
  const db = connectDB();
  await db.query(
    `UPDATE "Images" SET "isUploaded"=TRUE WHERE "name"='${name}'`,
  );
};
