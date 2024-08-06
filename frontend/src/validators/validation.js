export const isEmpty = (value) => {
  return !value.trim();
};

export const validateLoginForm = (email, password) => {
  let validationErrMsg = {};

  if (typeof email !== "string" || typeof password !== "string") {
    validationErrMsg.general = "Email and password must be string.";
  }

  if (isEmpty(email)) {
    validationErrMsg.email = "Email address is required";
  }

  if (isEmpty(password)) {
    validationErrMsg.password = "Password is required";
  }

  return Object.keys(validationErrMsg).length === 0 ? null : validationErrMsg;
};
