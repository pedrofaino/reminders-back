import { tokenVerificationErrors } from "../utils/tokenManager.js";
import jwt from "jsonwebtoken";


export const requireRefreshToken = (req, res, next) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) throw new Error("No existe el token");

    const { uid } = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH);

    req.uid = uid;

    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: tokenVerificationErrors[error.message] });
  }
};

export const refreshTokenMiddleware = (req, res, next) => {

  const accessToken = req.headers.authorization;

  if (!accessToken || !accessToken.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso no proporcionado' });
  }

  const token = accessToken.split(' ')[1];

  const { uid } = jwt.verify(token, process.env.JWT_REFRESH)

  // const {uid} = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
  //   if (err) {
  //     return res.status(401).json({ error: 'Token de acceso no válido' });
  //   }
    
  //   const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
  //   if (expiresIn < 600) {
  //     const newAccessToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, {
  //       expiresIn: '15m'
  //     });
  //     res.setHeader('Authorization', `Bearer ${newAccessToken}`);
  //   }
  // });
  req.uid = uid;

  next();
};