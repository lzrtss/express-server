import userService from '../services/userService.js';
import { catchAsync } from '../utils/index.js';

export const activate = catchAsync(async (req, res, next) => {
  const { link } = req.params;

  await userService.activateUser(link);

  return res.redirect(process.env.CLIENT_URL);
});

export const getMe = (req, res, next) => {
  const user = req.user;

  res.status(200).json({
    user,
  });
};
