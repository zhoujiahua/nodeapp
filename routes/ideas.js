const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();

//引入模型
require("../models/Idea");
const Idea = mongoose.model("ideas");

//body-parser middleware
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

//ideas
router.get("/", (req, res) => {
    Idea.find({})
        .sort({
            date: "desc"
        })
        .then(ideas => {
            res.render("ideas/index", {
                ideas
            });
        })
})

//添加
router.get("/add", (req, res) => {
    req.flash("success_msg", "数据添加成功！")
    res.render("ideas/add");
})

//编辑
router.get("/edit/:id", (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            res.render("ideas/edit", {
                idea
            });
        })
})

//PUT 实现编辑
router.put("/:id", (req, res) => {
    Idea.findOne({
            _id: req.params.id
        })
        .then(idea => {
            idea.title = req.body.title;
            idea.details = req.body.details;
            idea.save()
                .then(idea => {
                    req.flash("success_msg", "数据编辑成功！")
                    res.redirect("/ideas")
                })
        })
})

//实现删除
router.delete("/:id", (req, res) => {
    Idea.remove({
            _id: req.params.id
        })
        .then(() => {
            req.flash("success_msg", "数据删除成功！")
            res.redirect("/ideas");
        })
})

//ideas
router.post("/", (req, res) => {
    let errors = [];
    if (!req.body.title) {
        errors.push({
            text: "请输入标题！"
        })
    }
    if (!req.body.details) {
        errors.push({
            text: "请输入详情！"
        })
    }
    if (errors.length > 0) {
        res.render("ideas/add", {
            errors,
            title: req.body.title,
            details: req.body.details
        })
    } else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                res.redirect("/ideas");
            })
    }
})

module.exports = router;