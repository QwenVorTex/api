const express = require("express");
const router = express.Router();

const userInfoHandler = require("../router-handler/userInfo");

router.get("/userInfo", userInfoHandler.getUserInfo);
router.post("/userInfo", userInfoHandler.updateUserInfo);

module.exports = router;
