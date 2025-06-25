const database = require("../database/index.js");

exports.getUserInfo = (req, res) => {
  console.log("=== 获取用户信息接口被调用 ===");
  console.log("请求用户:", req.user);

  // 检查用户信息是否存在
  if (!req.user) {
    return res.status(401).send({
      status: 401,
      message: "用户未登录或token无效",
    });
  }

  const userId = req.user.id; // 从 JWT 中获取用户 ID

  // 查询用户信息
  const sql =
    "SELECT id, username, age, phone, email FROM ev_users WHERE id = ?";

  database.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("数据库查询错误:", err);
      return res.status(500).send({
        status: 500,
        message: "获取用户信息失败",
      });
    }

    if (results.length === 0) {
      return res.cc("该用户不存在", 404);
    }

    // 返回用户信息
    res.send({
      status: 200,
      message: "成功获取用户信息",
      data: results[0],
    });
  });
};
exports.updateUserInfo = (req, res) => {
  console.log("=== 更新用户信息接口被调用 ===");
  console.log("请求用户:", req.user);

  // 检查用户信息是否存在
  if (!req.user) {
    return res.status(401).send({
      status: 401,
      message: "用户未登录或token无效",
    });
  }

  const userId = req.user.id; // 从 JWT 中获取用户 ID
  const sql = `SELECT id, username, age, phone, email FROM ev_users WHERE id = ?`;

  database.query(sql, [sql], (err, results) => {
    if (err) {
      console.error("数据库查询错误:", err);
      return res.status(500).send({
        status: 500,
        message: "更新用户信息失败",
      });
    }

    /* if (results.length === 0) {
      return res.cc("该用户不存在", 404);
    } */

    // 更新用户信息
    const updateSql = `UPDATE ev_users SET username = ?, age = ?, phone = ?, email = ? WHERE id = ?`;
    const { username, age, phone, email } = req.body;
    database.query(
      updateSql,
      [username, age, phone, email, userId],
      (err, results) => {
        if (err) {
          console.error("数据库更新错误:", err);
          return res.status(500).send({
            status: 500,
            message: "更新用户信息失败",
          });
        }
        res.send({
          status: 200,
          message: "成功更新用户信息",
          data: results[0],
        });
      }
    );
  });
};
