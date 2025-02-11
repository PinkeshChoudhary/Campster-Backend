const User = require("../models/user.js");

 const saveUser = async (req, res) => {
  try {
    const { uid, name, dob, email, phone } = req.body;

    let user = await User.findById(uid);

    if (!user) {
      user = new User({ _id: uid, name, dob, email, phone });
    } else {
      user.name = name;
      user.dob = dob;
      user.email = email;
    }

    await user.save();
    res.status(201).json({ success: true, message: "User saved", user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

const getUserByUID = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.findById(uid);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};
module.exports = { saveUser, getUserByUID, };
