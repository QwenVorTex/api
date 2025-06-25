//导入模块
const express = require("express");

const cors = require("cors");

const userRouter = require("./router/user.js");
const joi = require("@hapi/joi");

//创建服务器实例对象
const app = express();

// 添加请求日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

//封装响应函数
app.use((req, res, next) => {
  res.cc = (err, status = 200) => {
    res.status(status).send({
      status,
      message: err instanceof Error ? err.message : err,
    });
  };
  next();
});

app.use(cors());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/api", userRouter);

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error(err);

  if (err instanceof joi.ValidationError) {
    return res.cc(err, 400);
  }

  // 未知错误
  res.cc(err, 500);
});

//启动服务器
app.listen(8080, () => {
  console.log("服务器已启动, 地址: http://127.0.0.1:8080");
});
