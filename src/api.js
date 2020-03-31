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

router.get('/:table', (req, res, next) => {
	let table = req.params.table;
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
		qstring = queries.getLeaves();
	}
});
router.get('/adm');
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
