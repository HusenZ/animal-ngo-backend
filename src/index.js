import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import errorHandling from "./middlewares/errorHandler.js";
import { createUserTable } from "./data/createUserTable.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// middlewares
app.use(express.json());
app.use(cors());

// Crate table before starting table
createUserTable();

// routes
app.use("/api/users", userRoutes);

// error handling middleware
app.use(errorHandling);

// Testing postgres connection
app.get("/", async(req, res)=>{
    const result = await pool.query("SELECT current_database()");
    res.send(`The database name is : ${result.rows[0].current_databse}`);
})

//Server running
app.listen(port, ()=>{
    console.log(`server is running on the http:localhost:${port}`);
})