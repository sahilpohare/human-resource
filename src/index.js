const express       = require('express');
const app           = express();
const dotenv        = require('dotenv').config();
const {router}      = require('./authentication');
const {pool}        = require('./databasehandler');
const bodyparser    = require('body-parser');
const cookieparser  = require('cookie-parser');

app.use(cookieparser());
app.use(bodyparser.urlencoded({extended : true}));

app.use('/auth',router);
app.use('/',express.static(__dirname+'/public'));
app.listen(process.env.port || 3000,console.log('jingling on '+(process.env.port || 3000)));
