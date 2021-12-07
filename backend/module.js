import express from 'express';
import bodyParser from 'body-parser';
const app = express();
var cors=require("cors");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var isBase64= require('is-base64');
const sqlite3 = require('sqlite3').verbose();
 
// open the database
let db = new sqlite3.Database('./db/selfie', (err) => {
  if (err) {
    console.error(err.message);
  }
});

app.use(cors())
cors({credentials:true,origin:true})

var routes = require('./routes'); //importing route
routes(app); 

app.use(function(req,res,next){
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET', 'PUT', 'POST', 'DELETE', 'HEAD','PATCH', 'OPTIONS');
        res.setHeader('Access-Control-Allow-Headers',"Origin,X-Requested-With,Content-Type,Accept");
        next();
});

var path = require('path');
 

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
});

