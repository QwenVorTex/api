const database = require("../database/index.js");
const bcrypt = require("bcryptjs");

exports.getUserInfo = (req, res) => {
  console.log("=== 获取用户信息接口被调用 ===");
  console.log("请求用户信息:", req.body);

  // 从请求体中获取用户名和密码（与登录接口相同方式）
  const { username, password } = req.body;

  // 检查账号密码是否存在
  if (!username || !password) {
    return res.status(401).send({
      status: 401,
      message: "用户名和密码不能为空",
    });
  }

  // 验证账号密码
  const checkSql = "SELECT * FROM ev_users WHERE username = ?";
  database.query(checkSql, username, (err, results) => {
    if (err) {
      console.error("数据库查询错误:", err);
      return res.status(500).send({
        status: 500,
        message: "获取用户信息失败",
      });
    }

    if (results.length === 0) {
      return res.status(401).send({
        status: 401,
        message: "用户名或密码错误",
      });
    }

    // 验证密码
    const compareResult = bcrypt.compareSync(password, results[0].password);
    if (!compareResult) {
      return res.status(401).send({
        status: 401,
        message: "用户名或密码错误",
      });
    }

    // 查询用户信息
    const sql =
      "SELECT id, username, age, phone, email FROM ev_users WHERE username = ?";
    database.query(sql, [username], (err, userResults) => {
      if (err) {
        console.error("数据库查询错误:", err);
        return res.status(500).send({
          status: 500,
          message: "获取用户信息失败",
        });
      }

      if (userResults.length === 0) {
        return res.cc("该用户不存在", 404);
      }

      // 返回用户信息
      res.send({
        status: 200,
        message: "成功获取用户信息",
        data: userResults[0],
      });
    });
  });
};
exports.updateUserInfo = (req, res) => {
  console.log("=== 更新用户信息接口被调用 ===");
  console.log("请求用户信息:", req.body);

  // 从请求体中获取用户名和密码（与登录接口相同方式）
  const { username, password, newUsername, age, phone, email } = req.body;

  // 检查账号密码是否存在
  if (!username || !password) {
    return res.status(401).send({
      status: 401,
      message: "用户名和密码不能为空",
    });
  }

  // 验证账号密码
  const checkSql = "SELECT * FROM ev_users WHERE username = ?";
  database.query(checkSql, username, (err, results) => {
    if (err) {
      console.error("数据库查询错误:", err);
      return res.status(500).send({
        status: 500,
        message: "更新用户信息失败",
      });
    }

    if (results.length === 0) {
      return res.status(401).send({
        status: 401,
        message: "用户名或密码错误",
      });
    }

    // 验证密码
    const compareResult = bcrypt.compareSync(password, results[0].password);
    if (!compareResult) {
      return res.status(401).send({
        status: 401,
        message: "用户名或密码错误",
      });
    }

    const userId = results[0].id; // 获取用户ID

    // 更新用户信息
    const updateSql = `UPDATE ev_users SET username = ?, age = ?, phone = ?, email = ? WHERE id = ?`;
    database.query(
      updateSql,
      [newUsername || username, age, phone, email, userId],
      (err, updateResults) => {
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
          data: {
            id: userId,
            username: newUsername || username,
            age,
            phone,
            email,
          },
        });
      }
    );
  });
};
