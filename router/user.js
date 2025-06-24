const express = require("express");

const router = express.Router();

const userHandler = require("../router-handler/user");

const expressJoi = require("@escook/express-joi");
const { registerLoginSchema } = require("../schema/user");

// 用户注册接口
router.post("/register", expressJoi(registerLoginSchema), userHandler.register);
// router.post("/register", userHandler.register);


// 用户登录接口
router.post("/login", expressJoi(registerLoginSchema), userHandler.login);
// router.post("/login", userHandler.login);



module.exports = router;
