export const validateRegister = ({name, email, password}) => {
    const errors = [];

    if(!name || name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push("A valid email is required.");
  }

   if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters.");
  }

  return errors;
}

export const validateLogin = ({email, password}) => {
    const errors = [];

    if(!email ) {
        errors.push("email is required.");
    }

    if(!password ) {
        errors.push("Password is required");
    }

    return errors;
}

