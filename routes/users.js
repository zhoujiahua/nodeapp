const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const router = express.Router();

//body-parser middleware
router.use(bodyParser.urlencoded({
    extended: false
}));
router.use(bodyParser.json());

//login
router.get("/login", (req, res) => {
    res.render("users/login");
})

//register
router.get("/register", (req, res) => {
    res.render("users/register");
})


router.post("/register", (req, res) => {
    let errors = [];
    if (req.body.password != req.body.password2) {
        errors.push({
            text: "两次密码不一致！"
        })
    }
    if (req.body.password.length < 4) {
        errors.push({
            text: "密码长度不能小于4位"
        })
    }
    if (errors.length > 0) {
        res.render("users/register", {
            errors,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        })
    } else {
        res.send("success");
    }

})

module.exports = router;