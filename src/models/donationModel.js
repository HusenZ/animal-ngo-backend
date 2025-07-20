import db from "../config/db.js";

export const createDonationRequest = async ({ user_id, title, description }) => {
  const query = `
    INSERT INTO donation_requests (user_id, title, description)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [user_id, title, description];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const getAllDonationRequests = async () => {
  const { rows } = await db.query("SELECT * FROM donation_requests ORDER BY created_at DESC");
  return rows;
};

export const getDonationById = async (id) => {
  const { rows } = await db.query("SELECT * FROM donation_requests WHERE id = $1", [id]);
  return rows[0];
};

export const updateDonationStatus = async (id, status) => {
  const query = `UPDATE donation_requests SET status = $1 WHERE id = $2 RETURNING *;`;
  const { rows } = await db.query(query, [status, id]);
  return rows[0];
};

export const deleteDonation = async (id) => {
  const { rows } = await db.query("DELETE FROM donation_requests WHERE id = $1 RETURNING *", [id]);
  return rows[0];
};
