import Joi from 'joi';

const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,64})/;

export const userDataValidator = data =>
  Joi.object()
    .options({ abortEarly: false })
    .keys({
      username: Joi.string().alphanum().min(3).max(32).required(),
      email: Joi.string().email().required(),
      password: Joi.string().regex(PASSWORD_REGEX).required(),
    })
    .validate(data);
