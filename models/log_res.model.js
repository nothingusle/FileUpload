import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        require: true,
        unique: true
    },
    userEmail: {
        type: String,
        require: true,
        unique: true
    },
    userPassword: {
        type: String,
        require: true,
        unique: true
    },
    createAt:{
        type: Date,
        default: Date.now
    }
});

const userModel = mongoose.model('userJWT', userSchema);

export default userModel;
