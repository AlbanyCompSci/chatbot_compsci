const chalk = require('chalk');
const crypto = require('crypto');

exports.chatbot = (req, res) => {
	if (req.body.query == null) {
		res.status(400).json({ status: 400, message: { error: 'query cannot be null' } });
		console.log(console_time_stamp, chalk.red(`✖ Requested null query.`));
	} else {
		const session = crypto.createHash('md5').update(req.body.query).digest('hex');
		const time_stamp = new Date().getTime() / 1000;
		getChatResponse(req.body.query, session, time_stamp)
			.then((data) => {
				res.status(200).json({
					info: { timestamp: time_stamp, query: req.body.query, uuid: session },
					response: data.answer,
					data,
				});
				console.log(console_time_stamp, chalk.green(`✔ Query: ${req.body.query}`));
				console.log(console_time_stamp, chalk.cyan(`ℹ Response: ${data.answer}`));
			})
			.catch(function (err) {
				res.status(400).json({
					status: 400,
					message: { info: { timestamp: time_stamp, query: req.body.query, uuid: session }, error: 'unable to proccess request' },
				});
				console.log(console_time_stamp, chalk.red(`✖`, err));
			});
	}
};
