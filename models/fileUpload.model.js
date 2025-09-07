import mongoose from "mongoose";

const StudentSChema = mongoose.Schema({
  _id: {
    type: Number,
    unique: true,
    required: true,
  },
  student_name: {
    type: String,
    required: true,
  },
  student_age: {
    type: Number,
    required: true,
  },
  student_photo: {
    type: String,
    // required: true,
  },
});

const studentModel = new mongoose.model("studentsWithFile", StudentSChema);
export default studentModel;
