import express from "express";
import userModel from "../models/log_res.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
/* router.get("/register", async (req, res) => {
  try {
    let fin = req.body;
    let userReg = await userModel.find(fin);
    if (!userReg) return res.status(404).json("user not exist");
    res.status(201).json(userReg);
  } catch (err) {
    if (err) return res.status(404).json({ err: err, mes: "this user exist" });
  }
}); */

router.post("/register", async (req, res) => {
  try {
    const { userName, userPassword, userEmail } = req.body;
    let existUser = await userModel.findOne({
      $or: [{ userName }, { userEmail }],
    });
    if (existUser)
      return res.status(409).json({
        existUser,
        mes: "UserName and UserEmail already exist.",
      });
    // console.log("BODY:", req.body);
    // console.log("userPassword:", req.body.userPassword);

    const newPassword = await bcrypt.hash(userPassword, 10);
    const createNewUser = new userModel({
      userName,
      userEmail,
      userPassword: newPassword,
    });
    const saveNewUser = await createNewUser.save();
    const jwtToken = jwt.sign(
      { userId: saveNewUser._id, userName: saveNewUser.userName },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(201).json({
      mes: "User Registered successfully",
      user: saveNewUser,
      jwtToken,
    });
  } catch (err) {
    if (err)
      return res.status(500).json({ mes: "Something went wrong", err: err });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { userPassword, userEmail } = req.body;
    const userFind = await userModel.findOne({ userEmail });
    if (!userFind) return res.status(404).json({ mes: "User Not Found" });
    const passwordCMP = await bcrypt.compare(
      userPassword,
      userFind.userPassword
    );
    if (!passwordCMP) {
      return res.status(404).json({ mes: "Password Not Match" });
    }
    const jwtToken = jwt.sign(
      { userId: userFind._id, userName: userFind.userName },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );
    res.status(200).json({ mes: "User Login Successfully", jwtToken });
  } catch (err) {
    if (err) res.status(500).json({ err: err, mes: err.message });
  }
});

export default router;
