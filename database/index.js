const mysql = require("mysql");

// 创建数据库连接
const database = mysql.createPool({
  host: "192.168.31.68",
  user: "remote",
  password: "ccnuiotapp",
  database: "my_db_01",
});

module.exports = database;
