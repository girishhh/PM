const createPasswordLink = (token: String) => {
  return `/admins/create-password?token${token}`;
};

export { createPasswordLink };
