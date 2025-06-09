import authController from "./authController.js";
import userController from "../user/userController.js";

const register = async (req, res, next) => {
  try {
    const userData = req.body;

    const data = await authController.register({ userData });

    res.status(201).json({
      message: "User registered successfully",
      user: data.user,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const data = await authController.login({ email, password });

    res.cookie("token", data.token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 10 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
    });

    const { token, user } = data;
    res.status(200).json({
      message: "Login successful",
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error",
    });
  }
};

const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    message: "Logout successful",
  });
};

const recoverPassword = async (req,res, next) => {
  try {
    const { email } = req.body;
    await authController.recoverPassword(email);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(error.statusCode || 500).json({
      error: error.message || "Error sending email",
    });
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log("Token:", token);
    console.log("New Password:", newPassword);

    const result = await authController.resetPassword(token, newPassword);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// Nueva función: obtener info del usuario autenticado
const getMe = async (req, res, next) => {
  try {
    const { userId } = req.user;

    const user = await userController.getUserById(userId); // Este método lo implementas tú en authController.js

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login,
  logout,
  getMe,
  recoverPassword,
  resetPassword
};
