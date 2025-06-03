import { verifyToken } from "../utils/token.js";
import {
  UnauthorizedError,
  TokenExpiredError,
  InvalidTokenError,
} from "../utils/errors/authErrors.js";

function isLoggedInAPI(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization token not provided"));
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next(new TokenExpiredError("Token has expired"));
    }

    if (error.name === "JsonWebTokenError") {
      return next(new InvalidTokenError("Invalid token"));
    }

    console.error("Unexpected error verifying token:", error);
    return next(error);
  }
}

export { isLoggedInAPI };
