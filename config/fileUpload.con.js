import mongoose from "mongoose";

const mogoServer = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("mongoDB server connected successfully.. :)");
    })
    .catch((e) => {
      console.log(e);
    });
};
export default mogoServer;
