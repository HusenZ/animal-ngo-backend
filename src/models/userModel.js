import  pool  from '../config/db.js';

export const findUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

export const createUser = async (name, email, hashedPassword, role, phone_number, address) => {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, phone_number, address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, email, hashedPassword, role, phone_number, address]
  );
  return result.rows[0];
};
export const getNearbyUsers = async (latitude, longitude, distance) => {
  const query = `
    SELECT id, name, email, phone_number, address,
      ST_Distance(location, ST_MakePoint($1, $2)::geography) AS distance
    FROM users
    WHERE ST_DWithin(location, ST_MakePoint($1, $2)::geography, $3)
    ORDER BY distance ASC;
  `;
  const values = [longitude, latitude, distance];
  const { rows } = await pool.query(query, values);
  return rows;
};

export const updateUserLocation = async (userId, latitude, longitude) => {
  const query = `
    UPDATE users
    SET location = ST_SetSRID(ST_MakePoint($1, $2), 4326)::geography
    WHERE id = $3 RETURNING *;
  `;
  const values = [longitude, latitude, userId];
  const { rows } = await pool.query(query, values);
  return rows[0];
};
//------------------------------ SEPERATER --------------------
const getAllUserService = async () => {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
};

const getUserByIdService = async (id) => {
  const result = await pool.query('SELECT * FROM users WHERE id=$1', [id]); // fixed typo 'WEHRE' to 'WHERE'
  return result.rows[0];
};

const createUserService = async (name, email) => {
  const result = await pool.query('INSERT INTO users(name, email) VALUES ($1, $2) RETURNING *', [
    name,
    email,
  ]);
  return result.rows[0];
};

const updateUserService = async (name, email, id) => {
  const result = await pool.query('UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING *', [
    name,
    email,
    id,
  ]);
  return result.rows[0];
};

const deleteUserService = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [id]);
  return result.rows[0];
};

export {
  getAllUserService,
  getUserByIdService,
  createUserService,
  updateUserService,
  deleteUserService,
};
