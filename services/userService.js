import crypto from 'crypto';
import bcrypt from 'bcrypt';

import User from '../models/userModel.js';
import { apiError, createUserDto } from '../utils/index.js';

const createActivationLink = () => crypto.randomBytes(64).toString('hex');

const findUser = async findBy => {
  const user = await User.findOne(findBy);

  if (!user) {
    return apiError(400);
  }

  return user;
};

const findUserById = async id => {
  const user = await User.findById(id);

  if (!user) {
    return apiError(400);
  }

  return user;
};

const activateUser = async activationLink => {
  const user = await User.findOne({ activationLink });

  if (!user) {
    return apiError(400, 'Incorrect activation link');
  }

  user.isActivated = true;

  await user.save();

  return user;
};

const authenticateUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    return apiError(400, 'Incorrect email or password');
  }

  const isPasswordEqual = await bcrypt.compare(password, user.password);

  if (!isPasswordEqual) {
    return apiError(400, 'Incorrect email or password');
  }

  return user;
};

const createUser = async (username, email, password) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return apiError(409, 'Email taken');
  }

  const activationLink = createActivationLink();
  const user = await User.create({
    username,
    email,
    password,
    activationLink,
  });

  return user;
};

export default {
  findUser,
  findUserById,
  activateUser,
  authenticateUser,
  createUser,
};
