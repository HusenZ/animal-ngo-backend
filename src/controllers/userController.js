import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser } from '../models/userModel.js';

const generateToken = (user) => {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone_number, address } = req.body;

    if (!name || !email || !password || !role || !phone_number || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, email, hashedPassword, role, phone_number, address);
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone_number: user.phone_number,
        address: user.address,
      },
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

/*
----------------------------OLD PRACTICE CODE-----------------------

import {
  createUserService,
  getAllUserService,
  getUserByIdService,
  updateUserService, // fixed name
} from '../models/userModel.js';

const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    message,
    data,
  });
};

const registerUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const newUser = await createUserService(name, email);
    handleResponse(res, 201, 'User created successfully', newUser);
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await getAllUserService();
    handleResponse(res, 200, 'Users fetched successfully', users);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, 'User not found');
    handleResponse(res, 200, 'User fetched successfully', user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const updatedUser = await updateUserService(name, email, req.params.id); // corrected argument order
    if (!updatedUser) return handleResponse(res, 404, 'User not found');
    handleResponse(res, 200, 'User updated successfully', updatedUser);
  } catch (error) {
    next(error);
  }
};

export { registerUser, getAllUsers, getUserById, updateUser };
*/