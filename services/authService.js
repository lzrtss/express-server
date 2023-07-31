import mailService from './mailService.js';
import tokenService from './tokenService.js';
import userService from './userService.js';
import { createUserDto } from '../utils/createUserDto.js';

const signup = async (username, email, password) => {
  const user = await userService.createUser(username, email, password);

  const { accessToken, refreshToken } = tokenService.generateTokens(user.id);
  await tokenService.saveToken(user.id, refreshToken);

  await mailService.sendActivationLink(username, email, user.activationLink);

  return {
    accessToken,
    refreshToken,
    user: createUserDto(user),
  };
};

const login = async (email, password) => {
  const user = await userService.authenticateUser(email, password);

  const { accessToken, refreshToken } = tokenService.generateTokens(user.id);
  await tokenService.saveToken(user.id, refreshToken);

  return {
    accessToken,
    refreshToken,
    user: createUserDto(user),
  };
};

const logout = async refreshToken => {
  const tokenData = await tokenService.removeToken(refreshToken);

  return tokenData;
};

const refresh = async token => {
  const { accessToken, refreshToken, id } = await tokenService.refresh(token);

  const user = await userService.findUserById(id);

  return {
    accessToken,
    refreshToken,
    user: createUserDto(user),
  };
};

export default {
  signup,
  login,
  logout,
  refresh,
};
