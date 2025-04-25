import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import cors from "cors";

dotenv.config();

const app = express(); 
const DBURL = process.env.DBKEY || "without db key";
const APIKEY = process.env.KEYACCESS || "without api key";

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'] || "";

    if (!apiKey) {
        res.status(401).json({ message: 'API key is missing' });
        return 
    }

    if (apiKey !== APIKEY) {  
        res.status(401).json({ message: 'API key is incorrect' });
        return
    }

    console.log("API was tried to be accessed");
    next();
});

const connectToDB = async () => {
    try {
        await mongoose.connect(DBURL);
        console.log("DB connected");
    } catch (err) {
        console.log("DB connection error: ", err);
    }
};

connectToDB();

app.get('/', (req, res) => {
    res.send("Hello world");
    console.log("API was accessed");
});

app.listen(9000, () => {
    console.log("Server is running in https://localhost:9000");
});
