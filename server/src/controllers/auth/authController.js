import userModel from "../../models/userModel.js";
import { compare } from "../../utils/bcrypt.js";
import jwt from "jsonwebtoken";
import { sendRecoveryEmail } from "../../utils/mailer.js";
import { customAlphabet } from "nanoid";
import { UserEmailNotProvided, UserPasswordNotProvided, UserNameNotProvided, 
        UserEmailAlreadyExists, UserCreationFailed, EmailNotFound, InvalidCredentials, InvalidEmailFormat, InvalidPasswordFormat, AccountLockedError } from "../../utils/errors/authErrors.js";

const getRandomCode = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 6);

const MAX_ATTEMPTS = 3;
const LOCK_TIME = 30 * 60 * 1000; // 30 minutos

const login = async ({ email, password }) => {

  // Validaciones
  if (!email) throw new UserEmailNotProvided();
  if (!password) throw new UserPasswordNotProvided();

  // Buscar usuario por email
  const user = await userModel.findOne({ email });
  if (!user) throw new EmailNotFound();

  // Verificar si el usuario está bloqueado
  if (user.lockUntil && user.lockUntil > Date.now()) {
    throw new AccountLockedError("Account is temporarily locked. Please try again later.");
  }

  // Comparar contraseñas
  const isMatch = await compare(password, user.password);
  if (!isMatch) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;
    if (user.loginAttempts >= MAX_ATTEMPTS) {
      user.lockUntil = new Date(Date.now() + LOCK_TIME);
    }

    await user.save();
    throw new InvalidCredentials();
  }

  //Login exitoso: resetear contador y bloqueo
  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  // Generar token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "10h" }
  );

  return {
    token,
    user: {
      _id: user._id,
      userId: user._id,
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
      userId: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    }
  };
};

const recoverPassword = async (email) => {
  const user = await userModel.findOne({ email });
  if (!user) {
    const error = new Error("No user found with this email.");
    error.statusCode = 404;
    throw error;
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  console.log("el token es: ", token);

  // Guardar token y expiración en el usuario (opcional según tu lógica)
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hora
  await user.save();

  const recoveryUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  await sendRecoveryEmail(user.email, recoveryUrl);

  return {
    message: "Recovery email sent successfully.",
  }
}

const resetPassword = async (token, newPassword) => {
  const user = await userModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if(!user) {
    const error = new Error("Invalid or expired token.");
    error.statusCode = 400;
    throw error;
  }

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!newPassword || !passwordRegex.test(newPassword)) {
    throw new InvalidPasswordFormat();
  }
  
  user.password = newPassword;

  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();

  return { message: "Password reset successfully." };
};
  
export default { login, register, recoverPassword, resetPassword };
