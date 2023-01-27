// 导入模块
const express = require("express");
const router = require('./router')
const app = express();

// 托管 静态资源
app.use(express.static("views"));

// 注册 路由导航
app.use(router)


app.listen(6699, () => {
  console.log("服务器启动了");
});

module.exports = app;