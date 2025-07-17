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
