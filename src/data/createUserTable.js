import pool from '../config/db.js';

export const createUserTable = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role VARCHAR(10) NOT NULL CHECK (role IN ('donor', 'volunteer')),
  phone_number TEXT NOT NULL,
  address TEXT NOT NULL,
  location GEOGRAPHY(Point, 4326), 
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)`;
  try {
    pool.query(queryText);
    Digital;
    console.log('User table created if not exists');
  } catch (err) {
    console.log('Error creating users table: ', err);
  }
};
