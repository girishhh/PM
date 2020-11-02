const getCreatePasswordLink = (hostName: string, token: String) => {
  return `${hostName}/users/activate-account?token=${token}`;
};

const getConfirmationLink = (hostName: string, token: String) => {
  return `${hostName}/users/activate-account?token=${token}`;
};

export { getCreatePasswordLink, getConfirmationLink };
