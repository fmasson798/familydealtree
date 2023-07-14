const express = require('express');
const path = require('path');
let app = express();
let read;
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.set('view engine', 'ejs');
app.use(express.static('public'));


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

 //route for sign up button in footer
 app.get("/views/sign_up.ejs", (req, res) => {
    res.render('sign_up');
});

//  //route for User button in footer
//  app.get("/views/user.ejs", (req, res) => {
//     let read_data_from_db = ` SELECT * FROM user `;
//     connection.query( read, (err, userdbdata) => {
//         if(err) throw err;
//         res.render('user', {userdbdata});
//     });
// });

 //route for User button in footer
 app.get("/views/user.ejs", (req, res) => {
        res.render('user');
    });

// /************************ 
//   Testing User Data from Database
//   **************************/

// app.get('/user',  (req, res) => {
//     let read = ` SELECT * FROM user `;
//     connection.query( read, (err, userdata) => {
//         if(err) throw err;
//         res.render('user', {userdata});
//     });
// });




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

/************************ 
  Testing Database
  **************************/

// app.get('/user', (req, res) => {
//     let title = "User Table from Database";
//     let read_user_data = "SELECT * FROM user";
// });



app.listen(process.env.PORT || 3000, ()=>{ 
    console.log("server started on: localhost:3000");
});