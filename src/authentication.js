const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const {pool} = require('./databasehandler');
const queries = require('./queries');
var sessions = {
    "root" : {
        username : "root",
        role : "admin",
        firstname : "root",
        lastname : "root",
        email : "mail@root.com"
    },
};

router.delete('/users/signout',async(req,res,next)=>{
    let ssid = req.cookies.ssid;
    if(ssid == null){
        res.send('already signed out');
    }else{
        if(session[ssid] != null){
            delete session[ssid];
            res.send('logged out');
        }else{
            res.send('ok');
        }
    }
});

router.post('/users/login',async (req,res,next)=>{
    console.log(req.headers)
    let body = req.body;
    console.log("COOKIES" + req.cookies.ssid);
    console.log(sessions);

    if(req.cookies.ssid != null){
        if(Object.keys(sessions).includes(req.cookies.ssid)){
            console.log('already logged in as ' + sessions[req.cookies.ssid].firstname + ' ' + sessions[req.cookies.ssid].lastname);
            res.send(sessions[req.cookies.ssid]);
            return;
        }else{
            res.clearCookie('ssid');
        }
    }
    if(body.password != null && body.username != null){
        pool.query('select count(*) from users where username = $1 limit 1',[
            body.username,
        ]).then(
            val => {
                console.log(val.rows[0].count)
                if(val.rows[0].count == 0){
                    res.status(401);
                    res.send('no such user exists, Talk to HR');
                    console.log('no such user exists, Talk to HR');
                }else{
                    pool.query('select password from users where username = $1 limit 1',[body.username])
                    .then(async (val) => {
                            if(val.rows[0]['password'] == body.password)
                            {
                                pool.query('select * from users where username = $1 limit 1',[body.username])
                                .then(async (val)=>
                                    {
                                        session = await setSession(val.rows[0],req.headers["user-agent"]);
                                        console.log(req.headers['user-agent']);
                                        res.cookie('ssid',session.secret,{
                                            maxAge : 1000*60*60*4,
                                            sameSite : false
                                            //domain : `${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`
                                        });
                                        res.status(200);
                                        res.json(session.user);
                                        console.log(secret);
                                    }
                                ).catch(err=>console.log(err));

                            }else{
                                res.status(401)
                                res.send('wrong password');
                            }
                        }
                    )
                }
            }
        ).catch((err)=>{console.log(err); res.send(err)})
    }else{
       res.status(500);
       res.json({user : null,error : 'bad request'})
    }
});

router.post('/users/logout',(req,res,next)=>{
    res.clearCookie('ssid');
    res.send('logged out');
    delete sessions[req.cookies.ssid]
    console.log('logged out of' + req.cookies.ssid);
})
router.delete('/users/delete',(req,res,next)=>{
    let {uid} = req.body;
    pool.query(queries.deleteUser(uid),[]).then(
        (result) => {
            console.log(result);
            console.log('deleted User at '+ uid);
            res.send(result.rows);
        }
    ).catch((err)=>{
        console.log(err);
        res.status(500);
    })
});
router.post('/users/create',(req,res,next)=>{
    console.log('new User :' + req.body);
    let body = req.body;
    if(body.email != null && body.password != null&& body.username != null&& body.firstname != null&& body.lastname != null&& body.role != null){
        pool.query('INSERT INTO users(username,password,email,role,firstname,lastname) values ($1,$2,$3,$4,$5,$6)',[
            body.username,
            body.password,
            body.email,
            body.role,
            body.firstname,
            body.lastname
        ]).then(
            (val)=>{
                console.log('user created'+val);
                res.json(val);
            }
        ).catch(
            (err)=>{
                res.status(500)
                res.send(err)
                console.log(err);
            }
        );
    }
});

function validateSession(secret = "root"){
    return Object.keys(sessions).includes(secret);
}

async function setSession(user,useragent){
    secret = await bcrypt.hash(user.username+useragent,3);
    sessions[secret] = user;
    sessions[secret].password = null;
    delete sessions[secret].password;
    setTimeout(()=>{delete sessions[secret]},1000*60*60*4);
    console.log(sessions);
    return {secret,user};
}

function getActiveUser(secret = "root"){
    return sessions[secret];
}
module.exports = {router,sessions,getActiveUser,validateSession};

