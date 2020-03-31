const express = require('express');
const router = express.Router();
const roles = require('./roles');

router.get('/:userrole/gettabs',(req,res)=>{
    console.log(req.params['userrole']);
    console.log(roles[req.params['userrole']]);
    res.send(roles[req.params.userrole].UIOptions);
});

module.exports = {
    router
}