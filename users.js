export let users = [];

export const isValid = (username) => {
  return users.some((user) => user.username === username);
};

export const authenticateUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};
