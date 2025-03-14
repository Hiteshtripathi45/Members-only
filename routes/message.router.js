const express = require('express');
const pool = require('../db/pool');
const router = express.Router();
const { authMiddleware } = require('../auth/authentication');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

// Route to render the message creation form
router.get('/createmessages', authMiddleware, async (req, res) => {
  try {
    const checkid = req.user.id;
    const member = await pool.query('SELECT * FROM member_user WHERE id = $1', [checkid]);

    // Check if the user has joined
    if (member.rows[0].joined) {
      res.render('messageform');
    } else {
      res.redirect('/home');
    }
  } catch (error) {
    console.error('Error in /createmessages route:', error);
    res.redirect('/home');
  }
});

// Route to handle message creation
router.post('/createmessages', authMiddleware, async (req, res) => {
  const { title, message } = req.body;
  const userid = req.user.id;

  try {
    await pool.query('INSERT INTO messagetable (title, message, user_id) VALUES ($1, $2, $3)', [title, message, userid]);
    res.redirect('/home');
  } catch (error) {
    console.error('Error creating message:', error);
    res.redirect('/createmessages');
  }
});

// Route to render the home page
router.get('/home', async (req, res) => {
  try {
    const token = req.cookies.token;
    let isAuthenticated = false;
    let joinedStatus = false;

    if (token) {
      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-default-secret-key');
        console.log('Decoded token:', decoded); // Debugging

        isAuthenticated = true;

        // Fetch the user's joined status
        const userResult = await pool.query('SELECT * FROM member_user WHERE id = $1', [decoded.id]);
        console.log('User result:', userResult.rows); // Debugging

        if (userResult.rows.length > 0) {
          joinedStatus = userResult.rows[0].joined;
        }
      } catch (err) {
        // Token verification failed
        console.error('Token verification failed:', err);
        isAuthenticated = false;
      }
    }

    // Fetch all messages
    const messages = await pool.query(`
            SELECT messagetable.title, messagetable.message, member_user.name
FROM messagetable
JOIN member_user ON messagetable.user_id = member_user.id
ORDER BY messagetable.id DESC;
        `);

    // Debugging: Log the joined status
    console.log('Joined status:', joinedStatus);

    // Render the home page with data
    res.render('home', {
      messages: messages.rows,
      auths: isAuthenticated,
      joined: joinedStatus
    });
  } catch (error) {
    console.error('Error in /home route:', error);
    res.status(500).send('Internal server error');
  }
});

router.get('/join', authMiddleware, (req, res) => {
  res.render('join')
})

router.post('/join', authMiddleware, async (req, res) => {
  const { password } = req.body
  const uid = req.user.id
  try {
    if (password == process.env.DB_PASSFORJOIN) {
      await pool.query('UPDATE member_user SET joined = true WHERE id = $1', [uid])
      return res.redirect('/home')
    }
    else {
      return res.redirect('/join')
    }

  } catch (error) {
    res.redirect('join')
  }


})

module.exports = router;