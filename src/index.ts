import express from "express";
import dotenv from "dotenv";
import datasetsRouter from "./routings/datasets.routing";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(express.json());

app.use("/api/datasets", datasetsRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
