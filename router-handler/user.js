//导入所需模块
const database = require("../database/index.js");
const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken"); // 注释掉JWT
// const { jwtSecret, jwtExpire } = require("../config.js"); // 注释掉JWT配置

// 用户注册接口
exports.register = (req, res) => {
  // 获取用户信息
  const userInfo = req.body;
  console.log("用户注册信息: ", userInfo);

  /* //对表单中的数据进行合法性校验
  if (!userInfo.username || !userInfo.password) {
    // return res.status(400).send({ status: 400, message: "用户名和密码不能为空" });
    return res.cc("用户名和密码不能为空", 400);
  }
  */

  // 检查用户名是否已存在
  const checkSql = "SELECT * FROM ev_users WHERE username = ?";
  database.query(checkSql, userInfo.username, (err, results) => {
    if (err) {
      console.error("数据库错误: ", err);
      //   return res.status(500).send({ status: 500, message: "注册失败，请稍后再试" });
      return res.cc("注册失败，请稍后再试", 500);
    }
    if (results.length > 0) {
      //   return res.status(400).send({ status: 400, message: "用户名已存在" });
      return res.cc("用户名已存在", 400);
    }

    // 用户名不存在，可以注册
    // 对密码进行加密
    userInfo.password = bcrypt.hashSync(userInfo.password, 10);

    // 插入新用户到数据库
    const insertSql = "INSERT INTO ev_users SET ?";
    database.query(
      insertSql,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        if (err) {
          console.error("插入数据库错误: ", err);
          // return res.status(500).send({ status: 500, message: "注册失败，请稍后再试" });
          return res.cc("注册失败，请稍后再试", 500);
        }
        if (results.affectedRows !== 1) {
          // return res.status(500).send({ status: 500, message: "注册失败，请稍后再试" });
          return res.cc("注册失败，请稍后再试", 500);
        }
        res.send({
          status: 200,
          message: "用户注册成功",
          user: { username: userInfo.username },
        });
      }
    );
  });
};

// 用户登录接口
exports.login = (req, res) => {
  const userInfo = req.body;

  const checkSql = "SELECT * FROM ev_users WHERE username = ?";

  console.log("用户登录信息: ", userInfo);

  database.query(checkSql, userInfo.username, (err, results) => {
    if (err) {
      console.error("数据库错误: ", err);
      // return res.status(500).send({ status: 500, message: "登录失败，请稍后再试" });
      return res.cc("登录失败，请稍后再试", 500);
    }

    if (results.length != 1) {
      return res.cc("用户不存在", 404);
    }

    // 验证密码
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );

    if (!compareResult) {
      res.status(400).send({ status: 400, message: "用户名或密码错误" });
    } else {
      const user = { ...results[0], password: "", userPic: "" };
      console.log("登录用户: ", user);

      // 移除JWT Token生成，直接返回成功信息
      /* const token = jwt.sign(user, jwtSecret, {
        expiresIn: jwtExpire,
      });
      console.log("生成的 Token: ", token); */

      res.send({
        status: 200,
        message: "用户登录成功",
        // token: `Bearer ${token}`, // 注释掉token返回
        user: { username: user.username, id: user.id }, // 添加用户ID，后续验证需要
      });
    }
    /* if (username && password) {
    res.send({ status: 200, message: "用户登录成功", user: { username } });
  } else {
    res.status(400).send({ status: 400, message: "用户名或密码错误" });
  } 
  */
  });
};
