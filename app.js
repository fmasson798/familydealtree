const express = require('express');
const path = require('path');
let app = express();
let read;
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// middleware to process form data
app.use(express.urlencoded({ extended: true }));

// connecting to PhpMyAdmin Database
const connection = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: '40200272',
    port: '3306',
    multipleStatements: true
});

// connect to database
connection.connect((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db");
});

// route from localhost:3000 to home landing page
app.get("/", (req, res) => {
    res.render('home');
});

 //route for home button on header navigation
app.get("/views/home.ejs", (req, res) => {
    res.render('home');
});

 //route for login button on header navigation
 app.get("/views/login.ejs", (req, res) => {
    res.render('login');
});

 //route for tiles of all deals button on header navigation
 app.get("/views/all_deals.ejs", (req, res) => {
    res.render('all_deals');
});

 //route for tiles of all vouchers button on header navigation
 app.get("/views/all_vouchers.ejs", (req, res) => {
    res.render('all_vouchers');
});

  /************************ 
  Testing form posting from web to db
  **************************/ 



 //route for sign up button in footer
 app.get("/views/sign_up.ejs", (req, res) => {
    res.render('sign_up');
});

app.post('/sign_up', (req, res) =>{ 

    let user_id = req.body.user_id;
    res.send(user_id);

});






  /************************ 
  Successful Testing of user data from db in user profile page
  **************************/ 

 //route for User button in footer
 app.get("/views/user.ejs", (req, res) => {
    let read = `SELECT * FROM user`;

    connection.query( read, (err, familydata) => {
        if(err) throw err;
        console.table(familydata);
        res.render('user', {familydata});
    });
});

 //route for card in footer - TO BE REMOVED
 app.get("/views/card.ejs", (req, res) => {
    res.render('card');
});

 //route for pill button in footer - TO BE REMOVED
 app.get("/views/pill_button.ejs", (req, res) => {
    res.render('pill_button');
});


// route for many deals button in footer - TO BE REMOVED
app.get("/views/many_deals.ejs", (req, res) => {
    res.render('many_deals')
});

// route for post a deal or voucher button in footer
app.get("/views/post_deal_voucher.ejs", (req, res) => {
    res.render('post_deal_voucher')
});


app.listen(process.env.PORT || 3000, ()=>{ 
    console.log("server started on: localhost:3000");
});