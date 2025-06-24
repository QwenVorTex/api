const mysql = require("mysql");

// 创建数据库连接
const database = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Qq13901517289",
  database: "my_db_01",
});

module.exports = database;
