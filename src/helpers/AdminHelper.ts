const createPasswordLink = (hostName: string, token: String) => {
  return `${hostName}/admins/create-password?token=${token}`;
};

export { createPasswordLink };
