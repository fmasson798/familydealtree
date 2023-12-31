const express = require("express");
const app = express();
const mysql = require("mysql");

const path = require("path");
const PORT = 3000;
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
     ROUTES  
**************************/

// All Deals (Just Deals)
app.get("/alldeals", (req, res) => {
  let read = `SELECT * FROM deal`;
  db.query(read, (err, dealdata) => {
    if (err) throw err;
    res.render("all_deals", { dealdata });
  });
});

//Individual Deal
app.get("/deal", (req, res) => {
  let getid = req.query.d_id;
  let read = `SELECT deal.deal_title, deal.deal_desc, deal.deal_link, deal.img_path, deal.price, deal.shipping_price,
            category.category_name, brand.brand_name, deal.start_date, deal.end_date, local_deal.local_deal_name, discount_type.discount_type_name, user.user_email
            FROM deal
            JOIN category ON deal.category_id = category.category_id
            JOIN brand ON deal.brand_id = brand.brand_id
            JOIN local_deal ON deal.local_deal_id = local_deal.local_deal_id
            JOIN discount_type ON deal.discount_type_id = discount_type.discount_type_id
            JOIN user ON deal.user_id = user.user_id
            WHERE deal.deal_id= ?;`;

  db.query(read, [getid], (err, dealdata) => {
    if (err) throw err;
    res.render("deal", { dealdata });
  });
});

//All deals A-Z (footer)
app.get("/alldealsAZ", (req, res) => {
  let read = `SELECT deal.deal_title, deal.img_path
  FROM deal
  ORDER BY deal.deal_title`;
  db.query(read, (err, dealdata) => {
    if (err) throw err;
    res.render("all_deals_AZ", { dealdata });
  });
});

//All vouchers
app.get("/allvouchers", (req, res) => {
  let read = `SELECT voucher.*, brand.brand_img_path
              FROM voucher
              JOIN brand ON voucher.brand_id = brand.brand_id`;
  db.query(read, (err, voucherdata) => {
    if (err) throw err;
    res.render("all_vouchers", { voucherdata });
  });
});

//Individual Voucher
app.get("/voucher", (req, res) => {
  let getid = req.query.v_id;
  let read = `SELECT voucher.voucher_title,
  voucher.voucher_discount, voucher.voucher_link, voucher.voucher_code,
  voucher.voucher_terms, voucher.end_date, category.category_name,
  brand.brand_name, discount_type.discount_type_name, user.user_email
     FROM voucher
     JOIN category ON voucher.category_id = category.category_id
    JOIN brand ON voucher.brand_id = brand.brand_id
    JOIN discount_type ON voucher.discount_type_id = discount_type.discount_type_id
    JOIN user ON voucher.user_id = user.user_id

    WHERE voucher.voucher_id= ?;`;

  db.query(read, [getid], (err, voucherdata) => {
    if (err) throw err;
    res.render("voucher", { voucherdata });
  });
});

//All vouchers A-Z (footer)
app.get("/allvouchersAZ", (req, res) => {
  let read = `SELECT voucher.*, brand.brand_img_path
                FROM voucher
                JOIN brand ON voucher.brand_id = brand.brand_id
                ORDER BY voucher.voucher_title`;
  db.query(read, (err, voucherdata) => {
    if (err) throw err;
    res.render("all_vouchers_AZ", { voucherdata });
  });
});

//all vouchers by discount value Ascending Order
app.get("/allvouchersbydiscountvalueasc", (req, res) => {
  let read = `SELECT voucher.*, brand.brand_img_path
  FROM voucher
  JOIN brand ON voucher.brand_id = brand.brand_id
  ORDER BY voucher.voucher_discount ASC`;
  db.query(read, (err, voucherdata) => {
    if (err) throw err;
    res.render("all_vouchers_by_discount_value_asc", { voucherdata });
  });
});

//all vouchers by discount value Descending Order
app.get("/allvouchersbydiscountvaluedesc", (req, res) => {
  let read = `SELECT voucher.*, brand.brand_img_path
  FROM voucher
  JOIN brand ON voucher.brand_id = brand.brand_id
  ORDER BY voucher.voucher_discount DESC`;
  db.query(read, (err, voucherdata) => {
    if (err) throw err;
    res.render("all_vouchers_by_discount_value_desc", { voucherdata });
  });
});

//Login
app.get("/login", (req, res) => {
  res.render("login");
});

// post login
app.post("/", (req, res) => {
  let useremail = req.body.emailField;
  let userpassword = req.body.passwordField;
  let checkuser =
    "SELECT * FROM user WHERE user_email = ? AND user_password = ?";

  db.query(checkuser, [useremail, userpassword], (err, rows) => {
    if (err) throw err;
    let numRows = rows.length;
    if (numRows > 0) {
      let sessionobj = req.session;
      sessionobj.authen = rows[0].user_id;
      res.redirect("/dashboard");
    } else {
      res.redirect("/");
    }
  });
});

// dashboard
app.get("/dashboard", (req, res) => {
  let sessionobj = req.session;
  if (sessionobj.authen) {
    let u_id = sessionobj.authen;
    let user = "SELECT * FROM user WHERE user_id = ?";
    db.query(user, [u_id], (err, row) => {
      let firstrow = row[0];
      res.render("dashboard", { userdata: firstrow });
    });
  } else {
    res.redirect("/login");
  }
});

app.get("/dashboard", (req, res) => {
  let getid = req.query.u_id;
  let read = `SELECT user.first_name,user.last_name,
        user.user_email, user.user_password
        , county.county_name
        FROM user
        JOIN county ON user.county_id = county.county_id
        WHERE user.user_id = ?;
`;

  db.query(read, [getid], (err, userdata) => {
    if (err) throw err;
    res.render("dashboard", { userdata });
  });
});

//add deal
app.get("/adddeal", (req, res) => {
  res.render("add_deal");
});

// post deal
app.post("/insertdeal", (req, res) => {
  let title = req.body.dtitle_field;
  let description = req.body.ddescription_field;
  let link = req.body.dlink_field;
  let image = req.body.dimage_field;
  let price = req.body.dprice_field;
  let shipping = req.body.dshipping_field;
  let category = req.body.category_field;
  let brand = req.body.brand_field;
  let startdate = req.body.sdate_field;
  let enddate = req.body.edate_field;
  let localdeal = req.body.local_deal_field;
  let discounttype = req.body.discount_type_field;
  let dealuser = req.body.user_field;

  let new_deal = ` INSERT INTO deal (deal_title, deal_desc, deal_link,
                   img_path, price, shipping_price, category_id,
                    brand_id, start_date, end_date, local_deal_id,
                     discount_type_id, user_id)
                    VALUES ( '${title}','${description}','${link}','${image}'
            ,'${price}', '${shipping}','${category}','${brand}','${startdate}'
            ,'${enddate}','${localdeal}','${discounttype}','${dealuser}');`;
  db.query(new_deal, (err, rowsobject) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

//edit deal
app.get("/editdeal", (req, res) => {
  res.render("edit_deal");
});

//delete deal page
app.get("/deletedeal", (req, res) => {
  res.render("delete_deal");
});

//delete the deal
app.delete("/deletedeal/:deal_id", (req, res) => {
  const delete_id = req.params.deal_id;
  db.query(`delete from deal where deal_id=?`, delete_id, (err, rowsobject) => {
    if (err) throw err;
    res.send("The deal has been deleted");
    console.log(rowsobject);
  });
});

//add voucher
app.get("/addvoucher", (req, res) => {
  res.render("add_voucher");
});

// post voucher
app.post("/insertvoucher", (req, res) => {
  let title = req.body.vtitle_field;
  let discountvalue = req.body.vdiscountvalue_field;
  let link = req.body.vlink_field;
  let code = req.body.vcode_field;
  let terms = req.body.vterms_field;
  let edate = req.body.edate_field;
  let category = req.body.category_field;
  let brand = req.body.brand_field;
  let discounttype = req.body.discount_type_field;

  let new_voucher = ` INSERT INTO voucher (voucher_title, voucher_discount,
                      voucher_link, voucher_code, voucher_terms,
                       end_date, category_id, brand_id, discount_type_id)
                        VALUES ( '${title}','${discountvalue}','${link}','${code}'
                       ,'${terms}', '${edate}','${category}','${brand}','${discounttype}');`;
  db.query(new_voucher, (err, rowsobject) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

//edit voucher
app.get("/editvoucher", (req, res) => {
  res.render("edit_voucher");
});

//delete voucher
app.get("/deletevoucher", (req, res) => {
  res.render("delete_voucher");
});

//Logout
app.get("/logout", (req, res) => {
  res.render("logout");
});

//post logout
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
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
  let role = req.body.role_field;

  let new_user = ` INSERT INTO user (user_email, user_password, 
        first_name, last_name, county_id, role)
            VALUES ( '${email}','${password}','${first_name}','${last_name}'
            ,'${county_id}', '${role}');`;
  db.query(new_user, (err, rowsobject) => {
    if (err) throw err;
    res.redirect("/dashboard");
  });
});

// route to like a post
app.get("/likes", (req, res) => {
  res.render("likes");
});

// Rate a post
app.get("/ratings", (req, res) => {
  res.render("ratings");
});

// Save a post
app.get("/saves", (req, res) => {
  res.render("saves");
});

// All Categories
app.get("/allcategories", (req, res) => {
  let read = ` SELECT * FROM category`;
  db.query(read, (err, categorydata) => {
    if (err) throw err;
    res.render("all_categories", { categorydata });
  });
});

// deals by category
app.get("/alldealsbycategory", (req, res) => {
  let getid = req.query.c_id;
  let read = `SELECT *
              FROM deal
              WHERE category_id = ?`;

  db.query(read, [getid], (err, dealdata) => {
    if (err) throw err;
    res.render("all_deals_by_category", { dealdata });
  });
});

// deals by location
app.get("/alldealsbylocaldeal", (req, res) => {
  let getid = req.query.l_id;
  let read = `SELECT *
              FROM deal
              WHERE local_deal_id = ?`;

  db.query(read, [getid], (err, dealdata) => {
    if (err) throw err;
    res.render("all_deals_by_local_deal", { dealdata });
  });
});

// vouchers by category
app.get("/allvouchersbycategory", (req, res) => {
  let getid = req.query.c_id;
  let read = `SELECT *
              FROM voucher
              WHERE category_id = ?`;

  db.query(read, [getid], (err, voucherdata) => {
    if (err) throw err;
    res.render("all_vouchers_by_category", { voucherdata });
  });
});

// All brands
app.get("/allbrands", (req, res) => {
  let read = ` SELECT * FROM brand`;
  db.query(read, (err, branddata) => {
    if (err) throw err;
    res.render("all_brands", { branddata });
  });
});

// deals by brand
app.get("/alldealsbybrand", (req, res) => {
  let getid = req.query.b_id;
  let read = `SELECT *
              FROM deal
              WHERE brand_id = ?`;

  db.query(read, [getid], (err, dealdata) => {
    if (err) throw err;
    res.render("all_deals_by_brand", { dealdata });
  });
});

// vouchers by brand
app.get("/allvouchersbybrand", (req, res) => {
  let getid = req.query.b_id;
  let read = `SELECT *
              FROM voucher
              WHERE brand_id = ?`;

  db.query(read, [getid], (err, voucherdata) => {
    if (err) throw err;
    res.render("all_vouchers_by_brand", { voucherdata });
  });
});

// All local deals (locations)
app.get("/localdeal", (req, res) => {
  let read = ` SELECT * FROM local_deal`;
  db.query(read, (err, localdealdata) => {
    if (err) throw err;
    res.render("local_deal", { localdealdata });
  });
});

// Home
app.get("/", (req, res) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
