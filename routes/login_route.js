const express = require('express')
const router = express.Router()
const axios = require('axios')

 //route for login button on header navigation
 app.get("/views/login.ejs", (req, res) => {
    res.render('login');
});