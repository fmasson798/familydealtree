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

app.post('/sign_up', (req, res) => {
    
    let email = req.body.email_field;
    let password = req.body.password_field;
    let first_name = req.body.first_name_field;
    let last_name = req.body.last_name_field;
    let dob = req.body.dob_field;
    let gender = req.body.gender_field;
    let county_id = req.body.county_field;
 
    let sqlinsert = ` INSERT INTO user ( user_email, user_password, 
                    first_name, last_name, dob, gender, county_id)
                     VALUES ( ?, ?, ?, ?, ?, ?, ?);`;

        connection.query(sqlinsert,[email,password,first_name,last_name,dob,gender,county_id] , (err, data_object) => { 
            
            if (err) throw err;
            res.send('well done it has been added');

        });
});

/* Johns Example

1.

app.get('/insertevent', (req, res) =>{
    res,render('create_event);
});


******** Anything that is _field is a name and is put after 
the <input***********
Example:
<input name="details_field" required>


2.

app.post('/insertevent', (req, res) => {
    let bandid = req.body.artist_field;
    let venue = req.body.venue_field;
    let event = req.body.details_field;
    let day = req.body.date_field;

    let sqlinsert = ` INSERT INTO gig_events ( band_id, venue, 
                    event_details, perform_on)
                    VALUES( '${bandid}', '${venue}', '${event}', '${day}' );
':

        connection.query(sqlinsert, (err, dataobj) => { 
            
            if (err) throw err;
        res.send(wwell done it has been added);

        });
});

My Example

app.post('/insertevent', (req, res) => {
    let first_name = req.body.first_name_field;
    let last_name = req.body.last_name_field;
    let email = req.body.email_field;
    let password = req.body.password_field;
    let dob = req.body.dob_field;
    let gender = req.body.gender_field;
    let county_id = req.body.county_field;
 


    let sqlinsert = ` INSERT INTO user ( user_id, user_email, user_password, 
                                    first_name, last_name, dob, gender, county_id)

                     VALUES ( '${first_name}', '${last_name}','${email}', '${password}',
                                '${dob}', '${gender}','${county_id}');`

        connection.query(sqlinsert, (err, data_object) => { 
            
            if (err) throw err;
        res.send(wwell done it has been added);

        });
});










*/




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