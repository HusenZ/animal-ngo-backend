import pkg from 'pg';
import dotenv from 'dotenv';
const {Pool} = pkg;
dotenv.config();

const pool = new Pool({
    user:process.env.DB_USER,
    host:process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DBPORT,
});

pool.on("connect", ()=>{
    console.log("Connection pool established with database");
})

export default pool;
