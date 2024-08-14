export const isEmpty = (value) => !value.trim();

export const validateLoginForm = (email, password) => {
  let validationErrMsg = {};

  if (typeof email !== "string" || typeof password !== "string") {
    validationErrMsg.general = "Email and password must be string.";
    return validationErrMsg;
  }

  if (isEmpty(email)) {
    validationErrMsg.email = "Email address is required";
  }

  if (isEmpty(password)) {
    validationErrMsg.password = "Password is required";
  }

  return validationErrMsg;
};

// Match one or more alphanumeric characters, dots, underscores, or hyphens for the username part.
// Match the "@" symbol.
// Match one or more alphanumeric characters, dots, or hyphens for the domain name.
// Match a period (dot), which separates the domain name and top-level domain (TLD).
// Match the TLD, consisting of 2 to 4 alphabetical characters.
const validateEmail = (email) => {
  return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);
};

// At least one lowercase letter
// At least one uppercase letter
// At least one number
// At least one special character
// Length must be in the range 8-15
const validatePassword = (password) => {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&^])[A-Za-z\d@.#$!%*?&]{8,15}$/.test(
    password,
  );
};

export const validateSignUpForm = (email, password, username) => {
  let validationErrMsg = {};

  if (!username || !email || !password) {
    validationErrMsg.general = "Please enter a username, email and password";
    return validationErrMsg;
  }

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    validationErrMsg.general = "Email, password and username must be strings.";
  }

  if (!validateEmail(email)) {
    validationErrMsg.email = "Enter a valid email address.";
  }

  if (!validatePassword(password)) {
    validationErrMsg.password =
      "Password must be between 8 and 15 characters long with atleast 1 uppercase, 1 number, and 1 special character.";
  }

  return validationErrMsg;
};
