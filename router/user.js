const express = require("express");

const router = express.Router();

const userHandler = require("../router-handler/user");
// 用户注册接口
router.post("/register", userHandler.register);

// 用户登录接口
router.post("/login", userHandler.login);

module.exports = router;
