import { User } from "../models/User.js";
import { getGoogleUser,getGoogleOAuthTokens,findAndUpdateUser } from "../service/auth.service.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    //validacion
    console.log(req)
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });
    await user.save();

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.status(201).json({ token, expiresIn });
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
    const { token, expiresIn } = generateToken(user.id);

    generateRefreshToken(user.id, res);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const googleOauthHandler = async(req,res) =>{
  try {
    const code = req.query.code;
    const {id_token,access_token} = await getGoogleOAuthTokens({code});
    const googleUser = await getGoogleUser({id_token, access_token});
    // jwt.decode(id_token)
    // console.log({googleUser})

    if(!googleUser.verified_email){
        return res.status(403).send('Google account is not verified.')
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
    generateRefreshToken(user.id, res);
    
    // return res.status(201).json({ token, expiresIn });
    return res.redirect(`${process.env.ORIGIN1}/main`);
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Error de servidor." });
}
}

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
    const { token, expiresIn } = generateToken(req.uid);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};
