const Adminfire = require('../models/adminFire');

const verifyAdmin = async (req, res, next) => {
  try {
    const userUID = req.query.uid; // ✅ Extract UID from query params
    // console.info("User ID:", userUID);

    if (!userUID) {
      return res.status(400).json({ message: "UID is required" });
    }

    const admin = await Adminfire.findOne({ uid: userUID });
    // if (!admin) {
    //   return res.status(403).json({ message: 'Access denied. Admins only', isAdmin: false });
    // }

    req.user = { uid: userUID, isAdmin: admin ? true : false };
    next(); // ✅ Proceed if admin
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { verifyAdmin };
