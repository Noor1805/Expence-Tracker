export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePassword = (password) => {
  // Min 6 chars
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && value !== "";
};
