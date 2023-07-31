import jwt from 'jsonwebtoken';

import Token from '../models/tokenModel.js';
import { apiError } from '../utils/apiError.js';

const generateTokens = id => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
  });

  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  });

  return {
    accessToken,
    refreshToken,
  };
};

const saveToken = async (userId, refreshToken) => {
  const tokenData = await Token.findOne({ user: userId });

  if (tokenData) {
    tokenData.refreshToken = refreshToken;
    await tokenData.save();

    return tokenData;
  }

  const token = await Token.create({ user: userId, refreshToken });

  return token;
};

const removeToken = async refreshToken => {
  const tokenData = await Token.deleteOne({ refreshToken });

  return tokenData;
};

const verifyAccessToken = accessToken => {
  const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

  return decoded;
};

const verifyRefreshToken = refreshToken => {
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  return decoded;
};

const findToken = async refreshToken => {
  const tokenData = await Token.findOne({ refreshToken });

  return tokenData;
};

const refresh = async token => {
  const payload = verifyRefreshToken(token);
  const tokenFromDB = await findToken(token);

  if (!payload || !tokenFromDB) {
    return apiError(401);
  }

  const { accessToken, refreshToken } = generateTokens(payload.id);
  await saveToken(payload.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    id: payload.id,
  };
};

export default {
  generateTokens,
  saveToken,
  removeToken,
  refresh,
  verifyAccessToken,
  verifyRefreshToken,
  findToken,
};
