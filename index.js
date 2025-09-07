import express from "express";
import mogoServer from "./config/fileUpload.con.js";
import fileRouter from "./routers/fileUpload.route.js";
import userRouter from "./routers/log_res.route.js";
import jwtAuth from "./middleware/jwtAuth.js";

import dotenv from "dotenv";
dotenv.config();
const app = express();
mogoServer();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/student", fileRouter);
app.use("/user", userRouter);
app.use(jwtAuth);
const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("hi this is fileUpload");
});

app.listen(PORT, () => {
  console.log(`server is started at localhost:${PORT}`);
});
