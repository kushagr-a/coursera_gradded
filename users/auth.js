const users = [];

const registerUser = (username, password) => {
  const userExists = users.find(u => u.username === username);
  if (userExists) return false;
  users.push({ username, password });
  return true;
};

const authenticateUser = (username, password) => {
  const user = users.find(u => u.username === username && u.password === password);
  return user ? true : false;
};

module.exports = {
  users,
  registerUser,
  authenticateUser
};
