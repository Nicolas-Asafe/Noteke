import mongoose from "mongoose";

const Schema = new mongoose.Schema({
    Name: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    Orgs:[{
        type: mongoose.Schema.Types.Mixed
    }]
})

const UserModel = mongoose.model('user', Schema)
export default UserModel