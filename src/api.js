const express = require('express');
const router = express.Router();
const { pool } = require('./databasehandler');
const { getActiveUser } = require('./authentication');
const queries = require('./queries');
const roles = require('./roles');

const verifyValidity = (requiredPrivlage) => (req, res, next) => {
	console.log(getActiveUser(req.cookies.ssid));
	if (req.cookies.ssid !== null) {
		if (roles[getActiveUser(req.cookies.ssid).role].previlage <= requiredPrivlage) {
			next();
		} else {
			res.status(401).send('Unauthorized for you motherfucker');
		}
	} else {
		res.status(401).send('Unauthorized for you motherfucker');
	}
};

router.get('/getData/:table', (req, res, next) => {
	let table = req.params.table;
	let uid;
	console.log(req.body)
	let qstring = ''; 
	console.log(req.params);
	if (table == 'users') {
		pool
			.query(queries.getUsers(), [])
			.then((val) => {
				console.log(val.rows);
				res.json({
					fields: val.fields.map((val) => val.name),
					data: val.rows.map((val) => Object.values(val))
				});
			})
			.catch((err) => res.send(err));
	}
	if (table == 'leaves') {
		if(req.params.uid){
			console.log('GOT WITH UID')
			pool
			.query(queries.getLeavesWithUid(req.params.uid))
			.then((val) => {
					console.log(val.rows);
					res.json({
						fields: val.fields.map((val) => val.name),
						data: val.rows.map((val) => Object.values(val))
					});
				})
				.catch((err) => res.send(err));
		}else{
			console.log("GOT ALL")
			pool
			.query(queries.getLeaves(), [])
			.then((val) => {
					console.log(val.rows);
					res.json({
						fields: val.fields.map((val) => val.name),
						data: val.rows.map((val) => Object.values(val))
					});
				})
				.catch((err) => res.send(err));
		}
	}
});

router.post('/leaves/approve',verifyValidity(3),(req,res,next)=>{
	let {leaveid} = req.body;
	console.log(queries.approveLeave()+leaveid)
    pool.query(queries.approveLeave(leaveid),[req.body.leaveid]).then(
        (result) => {
            console.log(result);
            console.log('approved Leave at '+ leaveid);
            res.send(result.rows);
        }
    ).catch((err)=>{
        console.log(err);
        res.status(500);
    })
});

router.post('/leaves/addLeave',(req,res,next)=>{
	console.log(req.body)
	console.log("ADD LEAVE" , req.body)
	let body = req.body;
	pool
	.query(queries.addLeave(req.body.from_to),[getActiveUser(req.cookies['ssid']).uid,String(req.body.from_to),req.body.leaveType])
	.then((val)=>res.status(200).send(val.rows))
	.catch(err=>console.log(err))
});

router.delete('/leaves/delete',(req,res,next)=>{
	let {leaveid} = req.body;
	console.log(queries.deleteLeave()+leaveid)
    pool.query(queries.deleteLeave(leaveid),[leaveid]).then(
        (result) => {
            console.log(result);
            console.log('deleted Leave at '+ leaveid);
            res.send(result.rows);
        }
    ).catch((err)=>{
        console.log(err);
        res.status(500);
    })
});

router.get('/users/:uid', (req, res) => {
    console.log(req);
	pool
		.query(queries.getUserWithUid(req.params.uid), [])
		.then((val) => {
			console.log('USER DETAILS' + val);
			if (val.rows.length > 0) {
				res.json(val.rows[0]);
			} else {
				res.status(404);
			}
		})
		.catch((err) => {
			console.log(err);
			res.send(500);
		});
});

module.exports = router;
