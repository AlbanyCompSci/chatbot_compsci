const controller = require('../controllers/chatbot.controller');
const { authJwt } = require('../middlewares');
const express = require('express');
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

	app.use(express.json());
	app.post('/chatbot/ask', [authJwt.verifyToken], controller.chatbot);
};
