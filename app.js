const express = require('express');
const path = require('path');
let app = express();
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(express.static('public'));




app.listen(process.env.PORT || 3000, ()=>{ 
    console.log("server started on: localhost:3000");
});