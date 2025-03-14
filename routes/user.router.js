const express = require('express')
const pool = require('../db/pool')
const router = express.Router()
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // 
const app = express()
app.use(cookieParser());






router.get('/signup', (req, res) => res.render('signup'))
router.post('/signup', async (req, res) => {
    const { name, username, email, password, confirmpassword } = req.body
    if (password !== confirmpassword) return res.send('password doesn match')
    try {
        const userexist = await pool.query('SELECT * FROM member_user WHERE username = $1 OR email = $2',
            [username, email])
        if (userexist.rows.length > 0) {
            return res.status(400).send('username or email already exist')
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newuser = await pool.query('INSERT INTO member_user(name, username, email, password) VALUES($1,$2,$3,$4) RETURNING id', [name, username, email, hashedPassword]);
        console.log('inserted sucessfully')
        const token = jwt.sign({ id: newuser.rows[0].id, email }, process.env.JWT_SECRET || 'your-default-secret-key', { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        res.redirect("/home");
    }
    catch (err) {
        console.error('error during setup', err);

        res.redirect('/signup')
    }
})


router.get('/login', (req, res) => {res.render('login')})

router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await pool.query('SELECT * FROM member_user WHERE email=$1', [email])
        if (user.rows.length == 0) {
            return res.redirect("/login");
        }
        const passcompare = await bcrypt.compare(password, user.rows[0].password)
        if (!passcompare) {
            return res.redirect("/login");
        }
        const token = jwt.sign({ id: user.rows[0].id, email }, process.env.JWT_SECRET || 'your-default-secret-key', { expiresIn: "1h" });
        res.cookie("token", token, { httpOnly: true });
        return res.redirect("/home");
    } catch (error) {
        console.error('this is error', error)
        res.status(500).send('error during logging')
        return res.redirect('/login')
    }
})


router.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/home");
});

module.exports = router;