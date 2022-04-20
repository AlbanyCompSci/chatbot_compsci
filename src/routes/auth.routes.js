const { verifySignUp } = require('../middlewares');
const controller = require('../controllers/auth.controller');
const chalk = require('chalk');

module.exports = function (app) {
	app.use(function (err, req, res, next) {
		res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
		if (err) {
			res.status(400).json({ status: 400, message: { error: 'cannot parse passed data' } });
			console.log(chalk.yellow(`  ⚠ Error while parsing data`));
		} else {
			next();
		}
	});

	app.post('/api/auth/signup', [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted], controller.signup);
	app.post('/api/auth/signin', controller.signin);
};
