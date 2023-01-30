import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail(),
  body("password").isLength({ min: 5 }),
];

export const registerValidator = [
  body("email", "Неверный формат почты").isEmail(),
  body("password", "Пароль должен быть больше 5 символов").isLength({ min: 5 }),
  body("fullName", "Укажите имя").isLength({ min: 5 }),
  body("avatarUrl", "Ошибка при загрузке изображения").optional().isString(),
];
