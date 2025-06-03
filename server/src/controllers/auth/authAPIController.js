import authAPIController from "./authAPIController.js";

const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    const data = await authAPIController.register({ email, password, name });

    res.status(201).json({
      message: "User registered successfully",
      ...data
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const data = await authAPIController.login({ email, password });

    res.status(200).json({
      message: "Login successful",
      ...data
    });
  } catch (error) {
    next(error);
  }
};

export default {
  register,
  login
};

