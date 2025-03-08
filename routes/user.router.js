const express = require('express')
const router = express.Router()

router.get('/signup',(req,res)=>res.render('signup'))
router.post('/signup',(req,res)=>{
    const {name ,username,email,password} = req.body
    res.send(req.body)
})


router.get('/login',(req,res)=>res.render('login'))

module.exports=router;