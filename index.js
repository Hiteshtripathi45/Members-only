const express = require('express')
const app = express()
const user= require('./routes/user.router')


app.set('view engine','ejs')
app.use('/',user)

app.get('/',(req,res)=>res.send('hello'))

app.listen(3000,()=>console.log('server is runing'))