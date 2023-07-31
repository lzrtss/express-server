import authService from '../services/authService.js';

import { catchAsync, convertDaysToMs } from '../utils/index.js';

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    maxAge: convertDaysToMs(30),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
};

export const signup = catchAsync(async (req, res, next) => {
  const { username, email, password } = req.body;

  const userData = await authService.signup(username, email, password);
  setRefreshTokenCookie(res, userData.refreshToken);

  return res.status(201).json(userData);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const userData = await authService.login(email, password);
  setRefreshTokenCookie(res, userData.refreshToken);

  return res.status(200).json(userData);
});

export const logout = catchAsync(async (req, res, next) => {
  const { refreshToken } = req.cookies;

  await authService.logout(refreshToken);
  res.clearCookie('refreshToken');

  return res.status(200).json({ token: refreshToken });
});

export const refresh = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  const { accessToken, refreshToken, user } = await authService.refresh(token);

  setRefreshTokenCookie(res, refreshToken);

  return res.status(200).json({ accessToken, refreshToken, user });
});
