const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");

const app = express();

//load router
const ideas = require("./routes/ideas");
const users = require("./routes/users");

//Connect to mongopse
mongoose.connect("mongodb://localhost/node-app")
    .then(() => {
        console.log("MongoDB数据库连接成功！");
    })
    .catch(err => {
        console.log(err)
    })

//引入模型
require("./models/Idea");
const Idea = mongoose.model("ideas");

//methodOverride
app.use(methodOverride('_method'));

//handlebars middleware
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

//body-parser middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

//使用静态文件
app.use(express.static(path.join(__dirname, "public")));

//session & flash
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))

app.use(flash());

//配置全局变量
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    next();
})


//首页
app.get("/", (req, res) => {
    const title = "我是主页标题";
    res.render('index', {
        title
    });
});

//about
app.get("/about", (req, res) => {
    res.render("about");
})


//使用router
app.use("/ideas", ideas);
app.use("/users", users);


//服务器端口配置
const port = process.env.PORT || 8088;
app.listen(port, () => {
    console.log(`正在监听：${port} 端口`);
})