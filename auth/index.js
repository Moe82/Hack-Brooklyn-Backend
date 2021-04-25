const express = require('express');
const router = express.Router();
const { Teacher } = require('../db/models');

router.post('/login', async (req, res, next) => {
	try {
		const teacher = await Teacher.findOne({ where: { email: req.body.email } });
		if (!teacher) {
			res.status(401).send('Wrong username and/or password');
		} else if (!teacher.correctPassword(req.body.password)) {
			res.status(401).send('Wrong username and/or password');
		} else {
			req.login(teacher, (err) => (err ? next(err) : res.json(teacher)));
		}
	} catch (err) {
		next(err);
	}
});

router.post('/signup', async (req, res, next) => {
	try {
		const teacher = await Teacher.create(req.body);
		req.login(teacher, (err) => (err ? next(err) : res.json(teacher)));
	} catch (err) {
		if (err.name === 'SequelizeUniqueConstraintError') {
			res.status(401).send('User already exists');
		} else {
			next(err);
		}
	}
});

router.get('/logout', function (req, res) {
	req.logout();
	req.session = null;
});

router.get('/me', (req, res) => {
	console.log(req.params);
	res.json(req.teacher);
});

module.exports = router;
