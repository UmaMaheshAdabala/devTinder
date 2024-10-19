const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName) throw new Error("Name is not valid!!!");
  else if (!validator.isEmail(emailId)) throw new Error("Invalid EmailId!!!");
  else if (!validator.isStrongPassword(password))
    throw new Error("Enter Strong Password!!");
};

const validateInputData = (req) => {
  const allowedData = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "photoUrl",
    "about",
  ];
  const isValidData = Object.keys(req.body).every((key) =>
    allowedData.includes(key)
  );
  return isValidData;
};

module.exports = { validateSignup, validateInputData };
