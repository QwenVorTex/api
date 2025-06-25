const express = require("express");
const router = express.Router();

const userInfoHandler = require("../router-handler/userInfo");

router.get("/userinfo", userInfoHandler.getUserInfo);

module.exports = router;
