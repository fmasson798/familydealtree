 const express = require("express");
 const router = express.Router()
 
 
 //route for login button on header navigation
 router.get("/views/login.ejs", (req, res) => {
    res.render('login');
});