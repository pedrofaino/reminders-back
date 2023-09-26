import { User } from "../models/User.js";
import { getGoogleUser, getGoogleOAuthTokens, findAndUpdateUser } from "../service/auth.service.js";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";
import { transporter } from "../utils/mailer.js";

export const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });

    const url = `https://reminder-s.vercel.app/confirmation?email=${email}`

    try {
      await transporter.sendMail({
        from: '"New Reminder" <reminders.new.info@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Confirmacion de correo", // Subject line
        text: "Confirmacion de correo", // plain text body
        html: `<b>Presiona el siguiente link para confirmar el email: ${url}`, // html body
      });
    } catch (error) {
      console.log(error)
    }

    await user.save();

    return res.status(201).json({ email });
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

export const confirmation = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    user.confirmed = true;

    await user.save();

    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    return res.json({ token, expiresIn });
  } catch (error) {
    console.log(error);
  }
}

export const registerApp = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) throw { code: 11000 };

    user = new User({ email, password });

    const url = `reminders://confirmation.com?email=${email}`;

    try {
      await transporter.sendMail({
        from: '"New Reminder" <reminders.new.info@gmail.com>', // sender address
        to: email, // list of receivers
        subject: "Confirmacion de correo", // Subject line
        text: "Confirmacion de correo", // plain text body
        html: `<b>Presiona el siguiente link para confirmar el email: ${url}`, // html body
      });
    } catch (error) {
      console.log(error)
    }

    await user.save();

    return res.status(201).json({ email });
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


export const confirmationApp = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });

    user.confirmed = true;

    await user.save();

    const userId = user.id;

    const { token, expiresIn } = generateToken(user.id);
    const { refreshToken } = generateRefreshToken(user.id, res);

    return res.json({refreshToken, token, expiresIn, userId });
  } catch (error) {
    console.log(error);
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const url = `https://reminder-s.vercel.app/confirmation?email=${email}`

    if (!user.confirmed) {
      try {
        await transporter.sendMail({
          from: '"New Reminder" <reminders.new.info@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Confirmacion de correo", // Subject line
          text: "Confirmacion de correo", // plain text body
          html: `<b>Presiona el siguiente link para confirmar el email: ${url}`, // html body
        });
      } catch (error) {
        console.log(error)
      }
      return res.status(403).json({ error: "Se ha enviado un email para confirmar, para iniciar sesión confirme su correo." });
    }

    const responsePassword = await user.comparePassword(password);
    if (!responsePassword) {
      return res.status(400).json({ error: "Credenciales incorrectas." });
    }
    const { token, expiresIn } = generateToken(user.id);

    const { refreshToken } = generateRefreshToken(user.id, res);

    const userId = user.id;

    return res.json({ refreshToken, token, expiresIn, userId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};


export const loginApp = async (req, res) => {
  try {
    console.log("llega la peticion")

    const { email, password } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }

    const url = `reminders://confirmation.com?email=${email}`

    if (!user.confirmed) {
      try {
        await transporter.sendMail({
          from: '"New Reminder" <reminders.new.info@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "Confirmacion de correo", // Subject line
          text: "Confirmacion de correo", // plain text body
          html: `<b>Presiona el siguiente link para confirmar el email: ${url}`, // html body
        });
      } catch (error) {
        console.log(error)
      }
      return res.status(403).json({ error: "Se ha enviado un email para confirmar, para iniciar sesión confirme su correo." });
    }

    const responsePassword = await user.comparePassword(password);
    if (!responsePassword) {
      return res.status(401).json({ error: "Credenciales incorrectas." });
    }
    const { token, expiresIn } = generateToken(user.id);

    const { refreshToken } = generateRefreshToken(user.id, res);

    const userId = user.id;

    return res.json({ refreshToken, token, expiresIn, userId });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const googleOauthHandler = async (req, res) => {
  try {
    const code = req.query.code;
    const { id_token, access_token } = await getGoogleOAuthTokens({ code });
    const googleUser = await getGoogleUser({ id_token, access_token });
    // jwt.decode(id_token)
    // console.log({googleUser})

    if (!googleUser.verified_email) {
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

export const refreshToken = async (req, res) => {
  try {
    const user = await User.findById(req.uid).lean();

    const uid = user._id;

    const email = user.email;

    const { token, expiresIn } = generateToken(req.uid);

    return res.json({ token, expiresIn, email, uid });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error de servidor." });
  }
};

export const logout = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};

export const forgotPassword = async (res, req) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.return(400).json({ message: "Email is required." })
    }
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({ error: "Check your email." });
    }

  } catch (error) {

  }
}