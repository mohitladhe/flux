// =======================
// Username Validation
// =======================

export const validateUsername = (username) => {
  if (!username.trim()) {
    return "Username is required.";
  }

  if (username.length < 5 || username.length > 12) {
    return "Username must be between 5 and 12 characters.";
  }

  const usernameRegex = /^[a-zA-Z0-9_.]+$/;

  if (!usernameRegex.test(username)) {
    return "Username can contain only letters, numbers, underscores and full stops.";
  }

  return "";
};

// =======================
// Email Validation
// =======================

export const validateEmail = (email) => {
  const value = email.trim();

  if (!value) {
    return "Email is required.";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Please enter a valid email address.";
  }

  return "";
};

// =======================
// Password Validation
// =======================

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

  if (!passwordRegex.test(password)) {
    return "Password must contain uppercase, lowercase, number and special character.";
  }

  return "";
};

// =======================
// Password Requirement Checker
// =======================

export const getPasswordChecks = (password) => {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[@$!%*?&^#()_\-+=]/.test(password),
  };
};

// =======================
// Form Validation
// =======================

export const validateRegisterForm = ({
  username,
  email,
  password,
}) => {
  return {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
  };
};

export const validateLoginForm = ({
  email,
  password,
}) => {
  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
};