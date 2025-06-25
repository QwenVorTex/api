const database = require("../database/index.js");

exports.getUserInfo = (req, res) => {
  const userId = req.user.id; // 从 JWT 中获取用户 ID

  // 查询用户信息
  database.query(
    "SELECT * FROM users WHERE id = ?",
    [userId],
    (err, results) => {
      if (err) {
        return res.cc(err, 500);
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
    }
  );
};
