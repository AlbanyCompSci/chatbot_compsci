const mongoose = require('mongoose');
const { chatbot } = require('../middlewares');
const Chatlog = mongoose.model(
	'chat_log',
	new mongoose.Schema({ timestamp: Number, user: String, query: String, session: String, response: String, raw: Object })
);

global.getChatResponse = async function log(query, session, timestamp) {
	let res_error = [
		'sorry, could you please repeat that again?',
		'hmm, did I hear something?',
		'wait, what did you say?',
		'excuse me, but I did not hear you correctly, could you please repeat that?',
		'sorry, but I could not understand...',
	];

	let random_not_found = res_error[Math.floor(Math.random() * res_error.length)];

	return chatbot.generateChatReply(query).then((res, err) => {
		if (res.answers.length == 0) {
			const chatlog = new Chatlog({
				timestamp: timestamp,
				session: session,
				query: query,
				response: random_not_found,
				raw: res,
			});
			chatlog.save((err) => {
				if (err) {
					console.log(err);
				}
			});
			return { res, answer: random_not_found };
		} else {
			const chatlog = new Chatlog({
				timestamp: timestamp,
				session: session,
				query: query,
				response: res.answer.toString(),
				raw: res,
			});
			chatlog.save((err) => {
				if (err) {
					console.log(err);
				}
			});
			return res;
		}
	});
};

module.exports = Chatlog;
