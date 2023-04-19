import { validationResult, body, param } from "express-validator";
import axios from "axios";

export const validationResultExpress = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

export const paramLinkValidator = [
  param("id", "Formato no valido")
  .trim()
  .notEmpty()
  .escape(),
  validationResultExpress
]

export const bodyLinkValidater = [
  body("longLink", "Formato link incorrecto.")
  .trim()
  .notEmpty()
  .custom(async value =>{
    try {
      await axios.get(value);
      return value;
    } catch (error) {
      // console.log(error)
      throw new Error("nos found longLink 404")
    }
  }),
  validationResultExpress
]

export const bodyRegisterValidator = [
  body("email", "Email incorrecto").trim().isEmail().normalizeEmail(),
  body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  body("password", "Formato de password incorrecto").custom(
    (value, { req }) => {
      if (value !== req.body.repassword) {
        throw new Error("No coinciden las contraseñas.");
      }
      return value;
    }
  ),
  validationResultExpress,
];

export const bodyLoginValidator = [
  body("email", "Email incorrecto").trim().isEmail().normalizeEmail(),
  body("password", "Minimo 6 caracteres").trim().isLength({ min: 6 }),
  validationResultExpress,
];
