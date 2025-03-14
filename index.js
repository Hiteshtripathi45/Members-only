const express = require('express')
const app = express()
require('dotenv').config();
const user= require('./routes/user.router')
const messagerouter = require('./routes/message.router')
const cookieParser = require("cookie-parser");
const path = require('path')
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine','ejs')


app.use('/',user)
app.use('/',messagerouter)
app.get('/',(req,res)=>res.redirect('/home'))

app.listen(port,()=>console.log('server is runing'))