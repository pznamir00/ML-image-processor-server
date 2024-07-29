import express from "express";
import dotenv from "dotenv";
import datasetsRouter from "./routings/datasets.routing";
import imagesRouter from "routings/images.routing";
import augmentationsRouter from "routings/augmentations.routing";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api/datasets", datasetsRouter);
app.use("/api/images", imagesRouter);
app.use("/api/augmentations", augmentationsRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
