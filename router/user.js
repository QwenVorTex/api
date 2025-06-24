const express = require("express");

const router = express.Router();

// 用户注册接口
router.post("/register", (req, res) => {
  const { username, password } = req.body;
  // 这里可以添加注册逻辑，比如保存用户信息到数据库
  res.json({ message: "用户注册成功", user: { username } });
});

// 用户登录接口
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  // 这里可以添加登录逻辑，比如验证用户信息
  if (username && password) {
    res.json({ message: "用户登录成功", user: { username } });
  } else {
    res.status(400).json({ message: "用户名或密码错误" });
  }
});

module.exports = router;
