const express = require("express");
const app = express();
const mysql = require("mysql");

const path = require("path");
const PORT = 4000;
const bodyParser = require("body-parser");

const cookieParser = require("cookie-parser");
const sessions = require("express-session");
const oneHour = 1000 * 60 * 60 * 1;

app.use(cookieParser());

app.use(
  sessions({
    secret: "myshows14385899",
    saveUninitialized: true,
    cookie: { maxAge: oneHour },
    resave: false,
  })
);

app.use(express.static("/public"));

//middleware to be able POST <form> data
app.use(express.urlencoded({ extended: true }));

//middleware to use the EJS template engine
app.set("view engine", "ejs");

// connecting to PhpMyAdmin Database
let db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "40200272",
  port: "3306",
});

// connect to database
db.connect((err) => {
  if (err) return console.log(err.message);
  console.log("connected to local mysql db");
});

/************************ 
 ADVICE FROM JOHN:
 **************************/

// shorten forms
// get one part working before adding the rest
// you don't need to include data you dont intend to use e.g.  dob on user page

/************************ 
     ROUTES  
**************************/

// Home
app.get("/", (req, res) => {
  res.render("home");
});

// All Deals (deals & vouchers)
app.get("/alldeals", (req, res) => {
  let read = `SELECT post_title, post_description, voucher_code,
        start_date, end_date, location, redemtion_instructions, website_link,
        image_path, terms_conditions, num_likes, num_ratings,post.user_id,
        post.brand_id,post.offer_type_id,post.discount_id,post.location_type_id
        
        FROM post
        
        INNER JOIN user ON post.user_id = user.user_email
        INNER JOIN brand ON post.brand_id = brand.brand_name
        INNER JOIN offer_type ON post.offer_type_id = offer_type.offer_type_name
        INNER JOIN discount ON post.discount_id = discount.discount_type
        INNER JOIN location_type ON post.location_type_id = location_type.location_type_name`;

  db.query(read, (err, postdata) => {
    if (err) throw err;
    res.render("all_deals_vouchers", { postdata });
  });
});

//All deals A-Z (footer)
app.get("/alldealsAZ", (req, res) => {
  res.render("all_deals_AZ");
});

//All vouchers A-Z (footer)
app.get("/allvouchersAZ", (req, res) => {
  res.render("all_vouchers_AZ");
});

//User Profile
app.get("/user", (req, res) => {
  let read = `SELECT user.first_name,user.last_name,
        user.user_email, user.user_password
        , county.county_name
        FROM user
        JOIN county ON user.county_id = county.county_id;`;
  db.query(read, (err, userdata) => {
    if (err) throw err;
    res.render("user", { userdata });
  });
});

//Login (directs to dashboard)
app.get("/login", (req, res) => {
  res.render("login");
});

// another route for dashboard?
app.get("/dashboard", (req, res) => {
  let sessionobj = req.session;
  if (sessionobj.authen) {
    let uid = sessionobj.authen;
    let user = "SELECT * FROM user WHERE user_id = ?";
    db.query(user, [uid], (err, row) => {
      let firstrow = row[0];
      res.render("dashboard", { userdata: firstrow });
    });
  } else {
    res.send("denied");
  }
});

//route for dashboard
app.get("/dashboard", (req, res) => {
  let sessionobj = req.session;

  if (sessionobj.authen) {
    let uid = sessionobj.authen;
    let user = "SELECT * FROM user WHERE id = ?";
    db.query(user, [uid], (err, row) => {
      let firstrow = row[0];
      res.render("/dashboard", { userdata: firstrow });
    });
  } else {
    res.send("denied");
  }
});

// posts form to dashboard
app.post("/", (req, res) => {
  let useremail = req.body.emailField;
  let checkuser = "SELECT * FROM user WHERE user_email = ? ";

  db.query(checkuser, [useremail], (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;
    if (numRows > 0) {
      let sessionobj = req.session;
      sessionobj.authen = rows[0].id;
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  });
});

//Sign up
app.get("/signup", (req, res) => {
  res.render("sign_up");
});

// post form to sign up
app.post("/insertuser", (req, res) => {
  let email = req.body.email_field;
  let password = req.body.password_field;
  let first_name = req.body.first_name_field;
  let last_name = req.body.last_name_field;
  let county_id = req.body.county_field;

  let new_user = ` INSERT INTO user (user_email, user_password, 
        first_name, last_name, county_id)
            VALUES ( '${email}','${password}','${first_name}','${last_name}'
            ,'${county_id}');`;
  db.query(new_user, (err, rowsobject) => {
    if (err) throw err;
    res.send(rowsobject);
  });
});

// Create a deal or Voucher
app.get("/postdealvoucher", (req, res) => {
  res.render("post_deal_voucher");
});

// Posts form to create Deal or Voucher
app.post("/insertoffer", (req, res) => {
  let title = req.body.title_field;
  let description = req.body.post_desc_field;

  let new_offer = ` INSERT INTO post (post_title, post_description)
            VALUES ( '${title}','${description}');`;
  db.query(new_offer, (err, rowsobject) => {
    if (err) throw err;
    res.send(rowsobject);
  });
});

// Like a post
app.get("/likes/:post_id", (req, res) => {
  const { post_id } = req.params;
  //code to handle the like operation, e.g., updating the post in the data store
  res.render("likes", { post_id });
});

// Rate a post
app.get("/ratings/:post_id", (req, res) => {
  const { post_id } = req.params;
  res.render("ratings", { post_id });
});

// Post a form to create a rating
app.post("/ratings/:post_id", (req, res) => {
  const { post_id } = req.params;
  const { rating } = req.body;
  //code to handle the like operation, e.g., updating the post in the data store
  res.redirect(`/post/${post_id}`);
});

// Save a post
app.get("/saves", (req, res) => {
  res.render("saves");
});

// All Categories
app.get("/allcategories", (req, res) => {
  let read = ` SELECT *
        FROM category `;
  db.query(read, (err, categorydata) => {
    if (err) throw err;
    res.render("all_categories", { categorydata });
  });
});

// All Brands
app.get("/allbrands", (req, res) => {
  let read = ` SELECT *
                FROM brand `;
  db.query(read, (err, branddata) => {
    if (err) throw err;
    res.render("all_brands", { branddata });
  });
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
