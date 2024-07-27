import express from "express";
import dotenv from "dotenv";
import Dataset from "./database/models/dataset";
import Augmentation from "./database/models/augmentation";

dotenv.config();

const app = express();
const port = process.env.PORT;

app.get("/datasets", async (req, res) => {
  const datasets = await Dataset.findAll({
    include: { model: Augmentation, as: Augmentation.tableName },
  });
  res.send(datasets);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
