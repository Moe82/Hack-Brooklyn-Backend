const router = require('express').Router();

router.use('/teachers', require('./teachers'));

//Anythingn not found gets a 404
router.use((req, res, next) => {
	const error = new Error('Not Found');
	error.status = 404;
	next(error);
});

//Export our api so we can use it on our server index file(main exit point for server)
module.exports = router;
