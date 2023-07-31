export const createUserDto = user => {
  user.password = undefined;
  user.activationLink = undefined;

  return user;
};
