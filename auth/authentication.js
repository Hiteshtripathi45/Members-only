
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
const express = require('express')
const app = express()
app.use(cookieParser());


const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!req.cookies || !req.cookies.token) {
        req.isauthenticate = false
        return res.redirect("/login");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET|| 'your-default-secret-key');
        req.user = decoded;
        req.isauthenticate=true
        next();
    } catch (err) {
        req.isauthenticate=false
        return res.redirect("/login");
    }
};

module.exports = {authMiddleware}