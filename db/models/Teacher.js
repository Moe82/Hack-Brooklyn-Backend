const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

const Teacher = db.define('teacher', {
	email: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false,
	},
	password: {
		type: Sequelize.STRING,
		get() {
			return () => this.getDataValue('password');
		},
	},
	salt: {
		type: Sequelize.STRING,
		get() {
			return () => this.getDataValue('salt');
		},
	},
	googleId: {
		type: Sequelize.STRING,
	},
});

Teacher.generateSalt = function () {
	return crypto.randomBytes(16).toString('base64');
};

Teacher.encryptPassword = function (plainText, salt) {
	return crypto
		.createHash('RSA-SHA256')
		.update(plainText)
		.update(salt)
		.digest('hex');
};

Teacher.prototype.correctPassword = function (candidatePwd) {
	return Teacher.encryptPassword(candidatePwd, this.salt()) === this.password();
};

const setSaltAndPassword = (teacher) => {
	if (teacher.changed('password')) {
		teacher.salt = Teacher.generateSalt();
		teacher.password = Teacher.encryptPassword(
			teachear.password(),
			teacher.salt()
		);
	}
};

Teacher.beforeCreate(setSaltAndPassword);
Teacher.beforeUpdate(setSaltAndPassword);

module.exports = Teacher;
