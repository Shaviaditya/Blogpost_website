const express = require('express');
const app = express();
const mongoose = require('mongoose');
const router = require('./routes/routes');
const routerx = require('./routes/auth_routes');
require('dotenv').config();
const URI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ydfmd.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(URI,{useNewUrlParser: true, useUnifiedTopology: true})
 .then((result)=> 
    app.listen((process.env.PORT),function(){
        console.log(`Server started at http://localhost:${process.env.PORT}`)
    })
  )
 .catch((err)=>console.log(err));
app.set('view engine','ejs');
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(router);
app.use(routerx);
