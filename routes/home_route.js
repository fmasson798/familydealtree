const express = require('express')
const router = express.Router()
const axios = require('axios')

// route from localhost:3000 to home landing page
app.get("/", (req, res) => {
    res.render('home');
});

 //route for home button on header navigation
app.get("/views/home.ejs", (req, res) => {
    res.render('home');
});