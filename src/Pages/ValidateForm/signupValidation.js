// validations/signupValidation.js

export const validateSignup = (name, email, password, role) => {
  const errors = {};

  if (name.length < 3 || name.length > 50) {
    errors.name = "Name must be between 3 and 50 characters";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    errors.email = "Please enter a valid email";
  }

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!])[A-Za-z\d@#$%^&*!]{8,}$/;

  if (!passwordRegex.test(password)) {
    errors.password =
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character";
  }

  if (!role) {
    errors.role = "Please select a role";
  }

  return errors;
};