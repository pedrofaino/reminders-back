import { User } from "../models/User.js";

export const infoUser = async (req, res) => {
  try {
    const email = req.params;
    const user = await User.findOne(email);
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ error: "error de server." });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, lastName, email } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { $set: { email: email, name: name, lastName: lastName } },
      { new: true })
      .then(userUpdate =>{
        return res.json(userUpdate);
      })
      .catch(error=>{
        console.log("Error: ",error)
        return res.status(500).json({ error: "error de server." });
      })
  } catch (error) {
    return res.status(500).json({ error: "error de server." });
  }
};
