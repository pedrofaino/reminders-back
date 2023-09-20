import { getGoogleUser, findAndUpdateUser } from "../service/auth.service.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";


export const googleOauthHandlerApp = async (req, res) => {
  try {
    const { id_token, access_token } = req;
    const googleUser = await getGoogleUser({ id_token, access_token });

    if (!googleUser.verified_email) {
      return res.status(403).send('Google account is not verified.');
    }
    const user = await findAndUpdateUser(
      {
        email: googleUser.email,
      },
      {
        email: googleUser.email,
        name: googleUser.name,
        picture: googleUser.picture,
      },
      {
        upsert: true,
        new: true,
      }
    );

    const { token, expiresIn } = generateToken(user.id);
    const { refreshToken } = generateRefreshToken(user.id, res);
    const userId = user.id;

    return res.status(201).json({ refreshToken, token, expiresIn, userId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};
