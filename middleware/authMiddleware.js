import tokenService from '../services/tokenService.js';
import userService from '../services/userService.js';
import {
  apiError,
  catchAsync,
  createUserDto,
  userDataValidator,
} from '../utils/index.js';

export const protectRoute = catchAsync(async (req, res, next) => {
  const accessToken =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];

  if (!accessToken) {
    return next(apiError(401));
  }

  const decodedToken = tokenService.verifyAccessToken(accessToken);

  if (!decodedToken) {
    return next(apiError(401));
  }

  const currentUser = await userService.findUserById(decodedToken.id);

  if (!currentUser) {
    return next(apiError(401));
  }

  req.user = createUserDto(currentUser);
  next();
});

export const validateUserData = catchAsync(async (req, res, next) => {
  const { error, value } = userDataValidator(req.body);
  const errorMessage = error?.details.map(error => error.message);

  if (error) {
    return next(apiError(400, errorMessage));
  }

  req.body = value;

  next();
});
