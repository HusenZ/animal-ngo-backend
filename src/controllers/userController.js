import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';
import pool from "../config/db.js";

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone_number, address, latitude, longitude } = req.body;

    if (!name || !email || !password || !role || !phone_number || !address || !latitude || !longitude) {
      return res.status(400).json({ message: 'All fields including location are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (name, email, password, role, phone_number, address, location)
      VALUES ($1, $2, $3, $4, $5, $6, ST_SetSRID(ST_MakePoint($7, $8), 4326))
      RETURNING id, name, email, role, phone_number, address
    `;
    const values = [name, email, hashedPassword, role, phone_number, address, longitude, latitude]; // Note lng first

    const result = await pool.query(insertQuery, values);
    const user = result.rows[0];
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};


export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    // For stateless JWT, logout is handled on client side
    res.status(200).json({ message: 'Logout successful. Please delete the token on the client.' });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query("SELECT id, name, email, role, phone_number, address, created_at FROM users WHERE id = $1", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone_number, address, role, latitude, longitude } = req.body;

  try {
    const userCheck = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    let query = `
      UPDATE users SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        phone_number = COALESCE($3, phone_number),
        address = COALESCE($4, address),
        role = COALESCE($5, role)
    `;

    const values = [name, email, phone_number, address, role];
    let index = 6;

    if (latitude && longitude) {
      query += `, location = ST_SetSRID(ST_MakePoint($${index}, $${index + 1}), 4326)`;
      values.push(longitude, latitude); // lng, lat
      index += 2;
    }

    query += ` WHERE id = $${index} RETURNING id, name, email, role, phone_number, address`;
    values.push(id);

    const result = await pool.query(query, values);

    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};



export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};

export const setUserLocation = async (req, res) => {
  const userId = req.params.id;
  const { latitude, longitude } = req.body;

  try {
    const updated = await User.updateUserLocation(userId, latitude, longitude);
    res.status(200).json({ message: 'Location updated', user: updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update location', details: err.message });
  }
};

export const getNearbyUsers = async (req, res) => {
  const { lat, lon, radius } = req.query;

  try {
    const users = await User.getNearbyUsers(lat, lon, radius || 5000); // default 5km
    res.status(200).json({ nearby: users });
  } catch (err) {
    res.status(500).json({ error: 'Error finding nearby users', details: err.message });
  }
};

// ADMIN ROUTE countroller
export const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, role, phone_number, address, created_at FROM users");
    res.status(200).json({ users: result.rows });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error: error.message });
  }
};
