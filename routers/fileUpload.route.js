import e from "express";
import multer from "multer";
import path, { dirname, join } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import studentModel from "../models/fileupload.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uploadPath = join(__dirname, "../upload");

export const routes = e.Router();

//* Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    let newFileName = Date.now() + path.extname(file.originalname);
    cb(null, newFileName);
  },
});

//* Multer File Filtering
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only Image Upload"), false);
  }
};

//* Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
});

//* Read All Student Data
routes.get("/", async (req, res) => {
  try {
    let studentsData = await studentModel.find();
    res.status(200).json(studentsData);
  } catch (err) {
    res.status(404).json(err);
  }
});
//* Read Student Data By Id

routes.get("/:id", async (req, res) => {
  try {
    let findStudentData = await studentModel.findById(req.params.id);
    if (!findStudentData) return res.status(404).json("Data not found");
    res.status(200).json(findStudentData);
  } catch (err) {
    res.status(404).json({ mes: "Id Not Match ☹", err: err });
  }
});

//* Inserting Student Data

routes.post("/", upload.single("student_photo"), async (req, res) => {
  try {
    if (!req.body._id) {
      if (req.file) {
        let dontUploadEnyErr = path.join(uploadPath, req.file.filename);
        fs.unlink(dontUploadEnyErr, (err) => {
          if (err)
            res
              .status(404)
              .json({ err: err, mes: "Failed To Delete Image During Error" });
        });
      }

      return res.status(404).json({ mes: "Please Enter Valid Data...☹" });
    }

    let insertingStudentData = new studentModel(req.body);
    if (req.file) {
      insertingStudentData.student_photo = req.file.filename;
    }
    let saveInsertData = await insertingStudentData.save();
    res.status(201).json({
      data: saveInsertData,
      mes: "Data Insert Successfully :)",
    });
  } catch (err) {
    res.status(404).json({ mes: "Failed To Insert Data ☹", err: err });
  }
});

//* Updating Student Data By Id

routes.put("/:id", upload.single("student_photo"), async (req, res) => {
  try {
    let existStudent = await studentModel.findById(req.params.id);
    if (req.file) {
      if (existStudent.student_photo) {
        let updateImage = path.join(uploadPath, existStudent.student_photo);
        fs.unlink(updateImage, (err) => {
          if (err)
            res
              .status(404)
              .json({ err: err, mes: "Failed to Update Image... ☹" });
        });
      }
      req.body.student_photo = req.file.filename;
    }

    let updataData = await studentModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    console.log(updataData);
    res
      .status(201)
      .json({ updataData: updataData, mes: "Data Update Successfully :)" });
    console.log(updataData);
  } catch (err) {
    res.status(404).json({
      mes: "Failed To Update Data...☹",
      err: err,
    });
  }
});

//* Deleting Student Data By Id
routes.delete("/:id", async (req, res) => {
  try {
    let deleteData = await studentModel.findByIdAndDelete(req.params.id);
    if (!deleteData) return res.status(404).json("Student Data Not Found... ☹");
    if (deleteData.student_photo) {
      let deleteImage = path.join(uploadPath, deleteData.student_photo);
      fs.unlink(deleteImage, (err) => {
        if (err)
          res
            .status(404)
            .json({ mes: "Failed To Delete image... ☹", err: err });
      });
    }
    res.status(201).json({ mes: "Data Deleted Successfully :)" });
  } catch (err) {
    res
      .status(500)
      .json({ err: err, mes: "Failed To Delete Student Data...☹" });
  }
});
