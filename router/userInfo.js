const express = require("express");
const router = express.Router();

router.get("/userInfo", (req, res) => {
  console.log("req.user:", req.user); // 调试日志

  // 检查 req.user 是否存在
  if (!req.user) {
    return res.status(401).send({
      status: 401,
      message: "用户未登录或token无效",
    });
  }

  res.send({
    status: 200,
    message: "获取用户信息成功",
    data: {
      username: req.user.username || "未知用户",
      email: req.user.email || "未设置邮箱",
      // 其他用户信息
    },
  });
});

module.exports = router;
