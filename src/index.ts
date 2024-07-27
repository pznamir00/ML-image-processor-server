import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import datasetsRouter from "./routings/datasets.routing";

dotenv.config();
const port = process.env.PORT;

const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use("/api/datasets", datasetsRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
