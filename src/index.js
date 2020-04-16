const express       = require('express');
const app           = express();
const dotenv        = require('dotenv').config();
const auth          = require('./authentication');
const apiRouter     = require('./api');
const ui            = require('./ui');
const {pool}        = require('./databasehandler');
const bodyparser    = require('body-parser');
const cookieparser  = require('cookie-parser');
const cors          = require('cors');

app.use(cookieparser());
app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});
app.use(cors());
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

app.use('/api/auth', auth.router);
app.use('/api/data', apiRouter);
app.use('/api/ui', ui.router);
app.get('/api/',(req,res)=>{
    res.json({server:'ss'});
});
app.use('/',express.static(__dirname+'/public/build'))
app.listen(process.env.port || 3000,console.log('jingling on '+(process.env.port || 3000)));
