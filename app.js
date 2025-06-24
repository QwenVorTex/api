//导入模块
const express = require("express");

const cors = require("cors");

//创建服务器实例对象
const app = express();

app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
  })
);

//启动服务器
app.listen(8000, () => {
  console.log("服务器已启动, 地址: http://127.0.0.1:8000");
});
