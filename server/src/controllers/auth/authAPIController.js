import { use } from "react";
import authController from "./authController.js";

const register = async (req, res, next) => {
  try {
    const userData = req.body;

    const data = await authController.register({ userData });

    res.status(201).json({
      message: "User registered successfully",
      user: data.user
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
      maxAge: 24 * 60 * 60 * 1000, // 24 horas
    });

    res.status(200).json({
      message: "Login successful",
      ...data
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(error.statusCode || 500).json({
      error: error.message || "Internal server error"
    });
  }
};


const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
  });

  res.status(200).json({
    message: "Logout successful"
  });
};


export default {
  register,
  login,
  logout
};

