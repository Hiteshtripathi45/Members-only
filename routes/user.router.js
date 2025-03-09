const express = require('express')
const pool = require('../db/pool')
const router = express.Router()
const bcrypt = require('bcrypt');

router.get('/signup',(req,res)=>res.render('signup'))
router.post('/signup',async(req,res)=>{
    const {name ,username,email,password,confirmpassword} = req.body
    if(password!==confirmpassword)return res.send('password doesn match')
    try{
        const userexist = await pool.query('SELECT * FROM member_user WHERE username = $1 OR email = $2',
            [username, email])
        if(userexist.rows.length>0){
           return res.status(400).send('username or email already exist')
        }    

        const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO member_user(name, username, email, password) VALUES($1,$2,$3,$4)',[name, username, email, hashedPassword]);
    console.log('inserted sucessfully')
    res.send('user created')
    }
    catch(err){
        console.error('error during setup',err);
        
        res.json({'message':err})
    }
})


router.get('/login', (req,res)=>res.render('login'))

router.post('/login',async(req,res)=>{
    const {email,password} = req.body 
    try {
        const user= await pool.query('SELECT * FROM member_user WHERE email=$1',[email])
        if(user.rows.length==0){
            res.status(400).send("password or email is incorrec")
        }
        const passcompare = await bcrypt.compare(password,user.rows[0].password)
        if(!passcompare){
            res.status(400).send('password or email is incorrect')
        }
        res.send('user logged')
    } catch (error) {
        console.error('this is error',error)
        res.status(500).send('error during logging')
    }
})

module.exports=router;