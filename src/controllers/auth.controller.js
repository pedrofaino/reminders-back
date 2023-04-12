import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validacion
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });
    await user.save();

    //jwt token
  } catch (error) {
    console.log(error.code);
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "El email ya esta siendo utilizado." });
    }
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "Credenciales incorrectas." });
    }

    const responsePassword = await user.comparePassword(password);
    if (!responsePassword) {
      return res.status(400).json({ error: "Credenciales incorrectas." });
    }

    //jwt

    const { token, expiresIn } = generateToken(user.id);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const infoUser = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();
    return res.json({ email: user.email, uid: user._id });
  } catch (error) {
    return res.status(500).json({ error: "error de server." });
  }
};
