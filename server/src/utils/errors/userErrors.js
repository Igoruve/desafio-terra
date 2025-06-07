
class UserNameNotProvided extends Error {
  constructor() {
    super("User name not provided");
    this.statusCode = 400;
  }
}

class UserEmailNotProvided extends Error {
  constructor() {
    super("User email not provided");
    this.statusCode = 400;
  }
}

class UserPasswordNotProvided extends Error {
  constructor() {
    super("User password not provided");
    this.statusCode = 400;
  }
}

class UserEmailAlreadyExists extends Error {
  constructor() {
    super("User email already exists");
    this.statusCode = 400;
  }
}

class UserInvalidCredentials extends Error {
  constructor() {
    super("Invalid credentials");
    this.statusCode = 401;
  }
}

class UserDoesNotExist extends Error {
  constructor(userId) {
    super(`User with ID ${userId} does not exist`);
    this.statusCode = 404;
  }
}

class UsersDoNotExist extends Error {
  constructor() {
    super(`Users do not exist`);
    this.statusCode = 404;
  }
}

class ApiKeyRequired extends Error {
  constructor() {
    super("ClickUp API key is required for project managers and admins");
    this.statusCode = 400;
  }
}

class RequestingUserNotFound extends Error {
  constructor() {
    super("Requesting user not found");
    this.statusCode = 404;
  }
}

class RoleChangeNotAllowed extends Error {
  constructor() {
    super("Only an admin can change user roles");
    this.statusCode = 403;
  }
}

class ApiKeyChangeNotAllowed extends Error {
  constructor() {
    super("Only an admin can change user API keys");
    this.statusCode = 403;
  }
}

class WorkspaceAlreadyAssigned extends Error {
  constructor() {
    super("User is already assigned to this workspace");
    this.statusCode = 400;
  }
}

export {
  UserNameNotProvided,
  UserEmailNotProvided,
  UserPasswordNotProvided,
  UserEmailAlreadyExists,
  UserInvalidCredentials,
  UserDoesNotExist,
  UsersDoNotExist,
  ApiKeyRequired,
  RequestingUserNotFound,
  RoleChangeNotAllowed,
  ApiKeyChangeNotAllowed,
  WorkspaceAlreadyAssigned
};
