"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const DBURL = process.env.DBKEY || "without db key";
const APIKEY = process.env.KEYACCESS || "without api key";
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((req, res, next) => {
    const apiKey = req.headers['x-api-key'] || "";
    if (!apiKey) {
        res.status(401).json({ message: 'API key is missing' });
        return;
    }
    if (apiKey !== APIKEY) {
        res.status(401).json({ message: 'API key is incorrect' });
        return;
    }
    console.log("API was tried to be accessed");
    next();
});
const connectToDB = async () => {
    try {
        await mongoose_1.default.connect(DBURL);
        console.log("DB connected");
    }
    catch (err) {
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
