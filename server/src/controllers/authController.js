import userModel from "../models/userModel.js";
import { hash, compare } from "./bcrypt.js";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import { UserEmailNotProvided, UserPasswordNotProvided, UserNameNotProvided, UserEmailAlreadyExists, UserCreationFailed } from "../utils/errors/authErrors.js";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const login = async ({ email, password }) => {

  // Validaciones
  if (!email) throw new UserEmailNotProvided();
  if (!password) throw new UserPasswordNotProvided();

  // Buscar usuario por email
  const user = await userModel.findOne({ email });
  if (!user) throw new EmailNotFound();

  // Comparar contraseñas
  const isMatch = await compare(password, user.password);
  if (!isMatch) throw new IncorrectPassword();

  // Generar token
  const token = jwt.sign(
    { _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id: user._id,
      userId: user.userId,
      name: user.name,
      role: user.role,
      email: user.email,
      createdAt: user.createdAt,
    }
  };
};

const register = async ({ userData }) => {

  const { email, password, name } = userData;

  // Validaciones de campos requeridos
  if (!email) throw new UserEmailNotProvided();
  if (!password) throw new UserPasswordNotProvided();
  if (!name) throw new UserNameNotProvided();

// Verificar si el email ya está en uso
  const existingEmail = await userModel.findOne({ email });
  if (existingEmail) throw new UserEmailAlreadyExists();

// Hashear la contraseña
  const hashedPassword = await hash(password, 10);
  const userId = getRandomCode();

const newUser = new userModel({
    userId,
    name: name,
    role: "client",
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  // Guardar en base de datos
  try {
    await newUser.save();
  } catch (error) {
    throw new UserCreationFailed();
  }

  // Generar token
  const token = jwt.sign(
    { _id: newUser._id, role: newUser.role },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return {
    token,
    user: {
      id: newUser._id,
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    }
};
};

export default { login, register };
