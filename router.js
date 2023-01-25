// 导入模块
var express = require("express");
var router = express.Router();

// 导入验证码模块
const svgCaptcha = require("svg-captcha");

const fs = require("fs");
// session模块
const session = require("express-session");
const bodyParser = require("body-parser");
const mongodbHelper = require("./views/lib/mongodbHelper");

router.use(bodyParser.urlencoded({ extended: false }));

// 设置session
router.use(
  session({
    secret: "eastern dragon",
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      // secure:true,
      maxAge: 600000,
    },
  })
);
// multer中间件
const multer = require("multer");
const upload = multer({ dest: "views/uploads/" });

// ----路由导航----
//获取验证码 将验证码返回
let captchaText = "";
router.get("/captcha", (req, res) => {
  //创建验证码
  //默认四位数验证码
  const captcha = svgCaptcha.create({
    noise: 3, //噪声线/干扰线
  }); //设置响应类型
  res.type("svg"); //响应数据
  res.status(200).send(captcha.data);
  captchaText = captcha.text;
  console.log(captchaText);
});

// (1) 账号 登出
router.get("/logout", (req, res) => {
  // req.session.cookie.maxAge = 0;
  req.session.destroy(function (err) {
    console.log(err);
})
  res.send({
    status: "success",
    msg: "退出成功",
  });
});
// (1) 账号 登录
router.post("/login", (req, res) => {
  const userName = req.body.userName;
  const userPass = req.body.userPass;
  const vCode = req.body.vCode;
  if (vCode !== captchaText) {
    res.send({
      msg: "验证码错误!!",
      status: "fail",
    });
    return;
  }
  mongodbHelper.find("userList", {}, (data) => {
    const accountPass = data.some(
      (val) => userName == val.userName && userPass == val.userPass
    );
    if (accountPass) {
      req.session.userinfo = userName;
      res.send({
        msg: "登录成功",
        status: "success",
      });
    } else {
      res.send({
        msg: "登录失败,账号或密码错误",
        status: "fail",
      });
    }
  });
});
// (1) 账号 注册
router.post("/register", (req, res) => {
  console.log("register");
  const userName = req.body.userName;
  const userPass = req.body.userPass;
  let accountExist = false;
  mongodbHelper.find("userList", {}, (data) => {
    accountExist = data.some((val) => userName == val.userName);
    if (accountExist) {
      res.send({
        msg: "注册失败,账号已存在!",
        status: "fail",
      });
    }
  });
  setTimeout(() => {
    if (!accountExist) {
      mongodbHelper.insert("userList", { userName, userPass }, (data1) => {
        console.log(data1);
        if (data1.acknowledged == true) {
          res.send({
            msg: "注册成功!",
            status: "success",
          });
        }
      });
    }
  }, 1000);
});
// (1) 获取用户账号
router.get("/getUserinfo", (req, res) => {
  // 是否已登录
  if (!req.session.userinfo) {
    res.send({
      status: "fail",
      msg: "未登录",
    });
    return;
  }
  res.send({
    status: "success",
    userName: req.session.userinfo,
  });
});

// (2) 获取英雄列表
router.get("/getHeroList", (req, res) => {
  console.log(req.session.userinfo);
  // 是否已登录
  if (!req.session.userinfo) {
    res.send({
      status: "fail",
      msg: "未登录",
    });
    return;
  }
  const pageIndex = req.query.pageIndex;
  const pageNum = req.query.pageNum;
  const queryName = req.query.queryName;
  const startIndex = (Number(pageIndex) - 1) * Number(pageNum);
  const endIndex = startIndex + Number(pageNum);
  mongodbHelper.find("heroList", {}, (data) => {
    if (data.length) {
      const queryHeroArr = data.filter(val=>{
        if(val.heroName.indexOf(queryName) != -1 || val.skillArr[0].skillName.indexOf(queryName)!=-1){
          return true;
        }
      }
      );
      let selectedHero = [];
      queryHeroArr.forEach((ele, index) => {
        if (index >= startIndex && index < endIndex) {
          selectedHero.push({
            heroName: ele.heroName,
            heroIcon: ele.heroIcon,
            heroId: ele._id,
            heroSkill: ele.skillArr[0],
          });
        }
      });
      res.send({
        totalNum: queryHeroArr.length,
        selectedHero,
      });
    } else {
      res.send({
        totalNum: 0,
        selectedHero: [],
      });
    }
  });
});
// (3) 获取某个英雄之详情
router.get("/getHero", (req, res) => {
  // 是否已登录
  if (!req.session.userinfo) {
    res.send({
      status: "fail",
      msg: "未登录",
    });
    return;
  }
  const heroId = req.query.heroId;
  mongodbHelper.find(
    "heroList",
    { _id: mongodbHelper.ObjectId(heroId) },
    (data) => {
      res.send(data[0]);
    }
  );
});

// (4) 接收数据 添加英雄
router.post("/addHero", upload.single("heroIcon"), function (req, res, next) {
  // 是否已登录
  if (!req.session.userinfo) {
    res.send({
      status: "fail",
      msg: "未登录",
    });
    return;
  }
  // req.file 是 `heroIcon` 文件的信息
  // req.body 将具有文本域数据，如果存在的话
  fs.rename(
    req.file.path,
    `views/uploads/${req.file.originalname}`,
    function (err) {
      if (err) {
        res.send({ msg: "英雄头像存入失败!!!", status: "fail" });
      } else {
        mongodbHelper.insert(
          "heroList",
          {
            heroName: req.body.heroName,
            skillArr: [{ skillName: req.body.skillName }],
            heroIcon: `uploads/${req.file.originalname}`,
          },
          (data) => {
            if (data.acknowledged == true) {
              res.send({
                msg: "英雄添加成功",
                status: "success",
              });
            } else {
              res.send({
                msg: "英雄添加失败",
                status: "fail",
              });
            }
          }
        );
      }
    }
  );
  // next();
});

// (4) 编辑某个英雄
router.post("/editHero", upload.single("heroIcon"), (req, res, next) => {
  // 是否已登录
  if (!req.session.userinfo) {
    res.send({
      status: "fail",
      msg: "未登录",
    });
    return;
  }
  fs.rename(
    req.file.path,
    `views/uploads/${req.file.originalname}`,
    function (err) {
      if (err) {
        res.send({ msg: "英雄头像存入失败!!!", status: "fail" });
      } else {
        mongodbHelper.update(
          "heroList",
          { _id: mongodbHelper.ObjectId(req.body.heroId) },
          {
            heroName: req.body.heroName,
            skillArr: [{ skillName: req.body.heroSkill }],
            heroIcon: `uploads/${req.file.originalname}`,
          },
          (data) => {
            if (data.acknowledged == true) {
              res.send({
                msg: "英雄编辑成功",
                status: "success",
              });
            } else {
              res.send({
                msg: "英雄编辑失败",
                status: "fail",
              });
            }
          }
        );
      }
    }
  );
  // next(); //会报错!!会再次发送响应体???
});

// (5) 删除某个英雄
router.post("/deleteHero", (req, res) => {
  // 是否已登录
  if (!req.session.userinfo) {
    res.send({
      status: "fail",
      msg: "未登录",
    });
    return;
  }
  const heroId = req.body.heroId;
  mongodbHelper.delete(
    "heroList",
    { _id: mongodbHelper.ObjectId(heroId) },
    (data) => {
      if (data.acknowledged == true) {
        res.send({
          msg: "英雄删除成功",
          status: "success",
        });
      } else {
        res.send({
          msg: "英雄删除失败",
          status: "fail",
        });
      }
    }
  );
});

module.exports = router;
