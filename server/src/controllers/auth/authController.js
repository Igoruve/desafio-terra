import userModel from "../../models/userModel.js";
import { hash, compare } from "../../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";
import { UserEmailNotProvided, UserPasswordNotProvided, UserNameNotProvided, 
        UserEmailAlreadyExists, UserCreationFailed, EmailNotFound, InvalidCredentials, InvalidEmailFormat, InvalidPasswordFormat } from "../../utils/errors/authErrors.js";

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
  if (!isMatch) throw new InvalidCredentials();

  // Generar token
  const token = jwt.sign(
    { userId: user.userId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
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

 // Expresiones regulares para validar el email y la contraseña
  const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
  // Control de errores
  if (!email || !emailRegex.test(email)) {
    throw new InvalidEmailFormat();
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!password || !passwordRegex.test(password)) {
    throw new InvalidPasswordFormat();
  }

  // Hashear la contraseña
  /*  const hashedPassword = await hash(password, 10);*/
  const userId = getRandomCode();

  const newUser = new userModel({
    userId: userId,
    name: name,
    email: email,
    password: password
  });

  // Guardar en base de datos
  try {
    await newUser.save();
  } catch (error) {
    console.error(error);
    throw new UserCreationFailed();
  }

  return {
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
