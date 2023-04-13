import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

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

    //generar el token jwt
    const { token, expiresIn } = generateToken(user.id);

    generateRefreshToken(user.id, res);

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

export const refreshToken = (req, res) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe el token");

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);
    
    const { token, expiresIn } = generateToken(uid);

    return res.json({token, expiresIn});

  } catch (error) {
    const TokenVerificationErrors = {
      "invalid signature": "La firma del JWT no es válida",
      "jwt expired": "JWT expirado",
      "invalid token": "Token no válido",
      "No Bearer": "Utiliza formato Bearer",
      "jwt malformed": "JWT fortmato no válido",
    };
    return res
      .status(401)
      .send({ error: TokenVerificationErrors[error.message] });
  }
};

export const logout = (req,res) =>{
  res.clearCookie('refreshToken')
  res.json({ok:true})
}
