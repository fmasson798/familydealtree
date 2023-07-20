const express = require('express');
const app = express();
const mysql = require('mysql');

const path = require('path');
const PORT = 3000;
const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');
const sessions = require('express-session');
const oneHour = 1000 * 60 * 60 * 1;

app.use(cookieParser());

app.use(sessions({
   secret: "myshows14385899",
   saveUninitialized: true,
   cookie: { maxAge: oneHour },
   resave: false
}));

app.use(express.static('public'));

//middleware to be able POST <form> data 
app.use(express.urlencoded({ extended: true }));

//middleware to use the EJS template engine
app.set('view engine', 'ejs');


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


 //route for home button on header navigation
app.get("/home", (req, res) => {
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

app.post('/insertuser', (req, res) => {
    let email = req.body.email_field;
    let password = req.body.password_field;
    let first_name = req.body.first_name_field;
    let last_name = req.body.last_name_field;
    let county_id = req.body.county_field;

    let new_user = ` INSERT INTO user (user_email, user_password, 
                    first_name, last_name, county_id)
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
// you don't need to include data you dont intend to use e.g.  dob on

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

 //route for login which directs to dashboard
 app.get("/login", (req, res) => {
    res.render('login');
});

//route for dashboard 
app.get('/dashboard', (req,res) => {
    let sessionobj = req.session;

    if(sessionobj.authen){
        let uid = sessionobj.authen;
        let user = 'SELECT * FROM user WHERE id = ?';
        db.query(user, [uid], (err, row)=>{ 

            let firstrow = row[0];
            res.render('/dashboard', {userdata:firstrow});
        });
    }else{
        res.send("denied");
    } 
});

app.post('/', (req,res) => {
    let useremail = req.body.emailField;
    let checkuser = 'SELECT * FROM user WHERE user_email = ? ';

    db.query(checkuser, [useremail], (err, rows)=>{
        if(err) throw err;
        let numRows = rows.length;
        if(numRows > 0){
            let sessionobj = req.session;  
            sessionobj.authen = rows[0].id; 
            res.redirect('/dashboard');
        }else{
            res.redirect('/');
        }
    });
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

app.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});