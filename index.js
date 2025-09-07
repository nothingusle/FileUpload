import e from "express";
import mogoServer from "./config/fileUpload.con.js";
import { routes } from "./routers/fileUpload.route.js";
const app = e();
mogoServer();
app.use(e.json());
app.use(e.urlencoded({ extended: false }));
app.use("/", routes);

const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("hi this is fileUpload");
});

app.listen(PORT, () => {
  console.log(`server is started at localhost:${PORT}`);
});
