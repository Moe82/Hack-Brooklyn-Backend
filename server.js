const express = require('express');
const passport = require('passport');
const cors = require('cors');
const path = require('path');
const fileUpload = require('express-fileupload');
const authRouter = require('./auth');
const db = require('./db');

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

app.use(
	express.json({
		limit: '50mb',
	})
);

app.use(express.urlencoded());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
	try {
		const user = await db.models.user.findByPk(id);
		done(null, user);
	} catch (err) {
		done(err);
	}
});
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', require('./api'));
app.use('/auth', authRouter);

app.use(express.urlencoded());
app.use(
	fileUpload({
		createParentPath: true,
	})
);

const serverRun = () => {
	const server = app.listen(PORT, () => {
		console.log(`Live on port : ${PORT}`);
	});
};

const syncDb = () => {
	if (process.env.NODE_ENV === 'production') {
		db.sync();
	} else {
		console.log('As a reminder, the forced synchronization option is on');
		db.sync({ alter: true })
			//.then(() => seed())
			.catch((err) => console.log(err));
	}
};

syncDb();
serverRun();

module.exports = app;
