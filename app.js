//uncomment next line for development usages
// require('dotenv').config({path:'./local.env'}) //change this to your own .env file, edit the public.env or comment this and use the --env-file option when building as docker container
const express = require('express');
const database = require('./src/configuration/database');
const framework = require('./src/configuration/framework');
const app = express();
const {logger} = require("fyrebrick-helper").helpers;
const route = require('./src/routes/routes');
const requestLogging = require('./src/middleware/logging').requests;

database.start();
framework.start(app);
app.use('/',requestLogging,route);
app.use((req,res,next)=>{
    res.status(404);
    res.render('error',{
        status:404,
        message:"This page was not found"
    })
})
require('events').EventEmitter.defaultMaxListeners = Number.MAX_SAFE_INTEGER;
