const express = require('express');
const router = express.Router();

const { Teacher } = require('../db/models');

// Routes for student

router.get('/', async (req, res, next) => {
	try {
		await Teacher.findAll().then((response) => res.json(response));
	} catch (error) {
		console.log(error);
	}
});

router.get('/:email', async (req, res, next) => {
	try {
		await Teacher.findAll({
			where: {
				email: req.params.email,
			},
		}).then((response) => res.json(response.id));
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
