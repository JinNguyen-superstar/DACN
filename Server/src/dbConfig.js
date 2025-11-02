/** @format */

import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config();

const username = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);

// console.log("DB_USERNAME:", process.env.DB_USERNAME);
// console.log(
//     "DB_PASSWORD:",
//     process.env.DB_PASSWORD
//         ? "***" + process.env.DB_PASSWORD.slice(-4)
//         : "undefined"
// );

const url = `mongodb+srv://${username}:${password}@pharmacy-db.w9vjyxj.mongodb.net/pharmacy-db?retryWrites=true&w=majority&appName=pharmacy-db`;

export const connectDB = async () => {
    try {
        await mongoose.connect(url);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
