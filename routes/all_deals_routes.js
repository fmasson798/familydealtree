const express = require('express')
const router = express.Router()
const axios = require('axios')
 
 //route for tiles of all deals button on header navigation
 app.get("/views/all_deals.ejs", (req, res) => {
    res.render('all_deals');
});