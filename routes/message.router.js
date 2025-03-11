const express = require('express')
const pool = require('../db/pool')
const router = express.Router()
const {authMiddleware} = require('../auth/authentication')


router.get('/createmessages',authMiddleware,(req,res)=>{
    res.render('messageform')
})

router.post('/createmessages',authMiddleware, async(req,res)=>{
      const {title, message}= req.body
      const userid = req.user.id
      try {
        await pool.query('INSERT INTO messagetable (title,message,user_id) VALUES($1,$2,$3)',[title,message,userid])
        res.redirect('/home')
      } catch (error) {
        console.error('Error creating message:', error)
        res.redirect('/createmessage')
      }
})

router.get('/home', async(req,res)=>{
  try {
    const messages = await pool.query(`
      SELECT messagetable.title, messagetable.message, member_user.name
      FROM messagetable
      JOIN member_user ON messagetable.user_id = member_user.id
  `);

  res.render('home', { messages: messages.rows })

  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).send('Internal server error');
    
  }
    res.render('home')

})

module.exports = router