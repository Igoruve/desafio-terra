class UserEmailNotProvided extends Error {
  constructor() {
    super("Email is required.");
    this.name = "UserEmailNotProvided";
    this.statusCode = 400;
  }
}

class UserPasswordNotProvided extends Error {
  constructor() {
    super("Password is required.");
    this.name = "UserPasswordNotProvided";
    this.statusCode = 400;
  }
}

class UserNameNotProvided extends Error {
  constructor() {
    super("Username is required.");
    this.name = "UserNameNotProvided";
    this.statusCode = 400;
  }
}

class UserEmailAlreadyExists extends Error {
  constructor() {
    super("Email is already in use.");
    this.name = "UserEmailAlreadyExists";
    this.statusCode = 409;
  }
}

class UserCreationFailed extends Error {
  constructor() {
    super("Failed to create user. Please try again.");
    this.name = "UserCreationFailed";
    this.statusCode = 500;
  }
}

class EmailNotFound extends Error {
  constructor() {
    super("Email not found.");
    this.name = "EmailNotFound";
    this.statusCode = 404;
  }
}

class InvalidCredentials extends Error {
  constructor() {
    super("Invalid credentials");
    this.name = "Invalid credentials";
    this.statusCode = 401;
  }
}

class UnauthorizedError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
    this.statusCode = 401;
  }
}

class TokenExpiredError extends Error {
  constructor(message = "Token expired") {
    super(message);
    this.name = "TokenExpiredError";
    this.statusCode = 401;
  }
}

class InvalidTokenError extends Error {
  constructor(message = "Invalid token") {
    super(message);
    this.name = "InvalidTokenError";
    this.statusCode = 401;
  }
}
class InvalidEmailFormat extends Error {
  constructor() {
    super("Invalid email format");
    this.name = "InvalidEmailFormat";
    this.statusCode = 400;
  }
}

class InvalidPasswordFormat extends Error {
  constructor() {
    super("Invalid password format");
    this.name = "InvalidPasswordFormat";
    this.statusCode = 400;
  }
}

class AccountLockedError extends Error {
  constructor(message) {
    super(message);
    this.name = "AccountLockedError";
    this.statusCode = 423;
  }
}

export {
  UserEmailNotProvided,
  UserPasswordNotProvided,
  UserNameNotProvided,
  UserEmailAlreadyExists,
  UserCreationFailed,
  EmailNotFound,
  InvalidCredentials,
  UnauthorizedError,
  TokenExpiredError,
  InvalidTokenError,
  InvalidEmailFormat,
  InvalidPasswordFormat,
  AccountLockedError
};
