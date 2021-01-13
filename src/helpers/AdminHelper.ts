const getCreatePasswordLink = (hostName: string, token: String) => {
  return `${hostName}/users/activate-account?token=${token}&type=password`;
};

const getConfirmationLink = (hostName: string, token: String) => {
  return `${hostName}/users/activate-account?token=${token}&type=confirmation`;
};

export { getCreatePasswordLink, getConfirmationLink };
