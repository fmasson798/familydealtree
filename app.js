const express = require('express');
const sessions = require('express-session');
const app = express();
const mysql = require('mysql');
const path = require('path');
const PORT = 4000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


app.use(express.static('public'));
// middleware to process form data
app.use(express.urlencoded({ extended: true }));


// session configuration
const halfDay = 1000 * 60 * 60 * 12;

app.use(sessions({
    secret: "thisismysecrctekey599",
    saveUninitialized: true,
    cookie: { maxAge: halfDay },
    resave: false 
}));

// connecting to PhpMyAdmin Database
let db = mysql.createConnection({
    host:'localhost',
    user: 'root',
    password: '',
    database: '40200272',
    port: '3306',
});

// connect to database
db.connect((err)=>{
    if(err) return console.log(err.message);
    console.log("connected to local mysql db");
});

app.set('view engine', 'ejs');

 //route for home button on header navigation
app.get("/", (req, res) => {
    res.render('home');
});

 //route for tiles of all deals button on header navigation
 app.get("/alldeals", (req, res) => {
    res.render('all_deals');
});

 //route for tiles of all vouchers button on header navigation
 app.get("/allvouchers", (req, res) => {
    res.render('all_vouchers');
});

  /************************ 
   
  Testing form posting from web to db

  **************************/ 

 //route for sign up button in footer
app.get('/signup', (req, res) =>{
    res.render('sign_up');
});

app.post('/insert_user', (req, res) => {
    let email = req.body.email_field;
    let password = req.body.password_field;
    let first_name = req.body.first_name_field;
    let last_name = req.body.last_name_field;
    let gender = req.body.gender_field;
    let county_id = req.body.county_field;

    let new_user = ` INSERT INTO user (user_email, user_password, 
                    first_name, last_name, gender, county_id)
                     VALUES ( '${email}','${password}','${first_name}','${last_name}'
                     ,'${county_id}');`
    db.query(
        new_user,
        (err, rowsobject) => { 
        if (err) throw err;
        res.send(rowsobject);
        }
    );
});


  /************************ 
   ADVICE FROM JOHN:
  **************************/

// shorten forms
// get one part working before adding the rest










  /************************ 
   START HERE 18/07/2023
  **************************/ 

 //route for User button in footer
app.get("/user", (req, res) => {
    let read = `SELECT user.first_name,user.last_name,
                 user.user_email, user.user_password
                 ,user.user_img_path, county.county_name
                FROM user
                JOIN county ON user.county_id = county.county_id;`;
    db.query( read, (err, userdata) => {
        if(err) throw err;
        res.render('user', {userdata});
    });
});


 //route for card in footer - TO BE REMOVED
 app.get("/card", (req, res) => {
    res.render('card');
});

 //route for pill button in footer - TO BE REMOVED
 app.get("/pillbutton", (req, res) => {
    res.render('pill_button');
});

 //route for all deals A-Z in footer - TO BE REMOVED
 app.get("/alldealsAZ", (req, res) => {
    res.render('all_deals_AZ');
});

 //route for all vouchers A-Z in footer - TO BE REMOVED
 app.get("/allvouchersAZ", (req, res) => {
    res.render('all_vouchers_AZ');
});

// route for many deals button in footer - TO BE REMOVED
app.get("/manydeals", (req, res) => {
    res.render('many_deals')
});

// route for post a deal or voucher button in footer
app.get("/postdealvoucher", (req, res) => {
    res.render('post_deal_voucher')
});

// route for all categories button in footer
app.get("/allcategories", (req, res) => {

    let read = ` SELECT *
                FROM category `;
    db.query( read, (err, categorydata) => {
        if(err) throw err;
        res.render('all_categories', {categorydata});
    });
});

// route for all brands button in footer
app.get("/allbrands", (req, res) => {
    let read = ` SELECT *
                FROM brand `;
    db.query( read, (err, branddata) => {
        if(err) throw err;
        res.render('all_brands', {branddata});
    });
});


// app.listen(process.env.PORT || 3000, ()=>{ 
//     console.log("server started on: localhost:3000");
// });

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});