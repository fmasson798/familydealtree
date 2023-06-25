const express = require('express')
const router = express.Router()
const axios = require('axios')
 
 //route for sign up button in footer
 app.get("/views/sign_up.ejs", (req, res) => {
    res.render('sign_up');
});