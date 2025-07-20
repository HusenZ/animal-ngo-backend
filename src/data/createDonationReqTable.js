// dbSetup.js
import pool from "../config/db.js"; // adjust path if needed

export const createDonationRequestsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS donation_requests (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT,
      status VARCHAR(20) DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("✅ donation_requests table created (or already exists)");
  } catch (error) {
    console.error("❌ Error creating donation_requests table:", error);
  }
};
