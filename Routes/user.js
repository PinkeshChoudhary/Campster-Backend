const express = require('express');
const  { saveUser, getUserByUID } = require("../controllers/userController.js");

const router = express.Router();

router.post("/user", saveUser);
router.get("/user/:uid", getUserByUID);

module.exports = router;
