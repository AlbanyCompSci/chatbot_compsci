const mongoose = require('mongoose');
const { chatbot } = require('../middlewares');
const Chatlog = mongoose.model(
	'chat_log',
	new mongoose.Schema({ timestamp: Number, user: String, query: String, session: String, response: String, raw: Object })
);

global.getChatResponse = async function log(query, session, timestamp) {
	return chatbot.generateChatReply(query).then((res, err) => {
		if (res.answers.length == 0) {
			const chatlog = new Chatlog({
				timestamp: timestamp,
				session: session,
				query: query,
				response: 'sorry, could you please repeat that again?',
				raw: res,
			});
			chatlog.save((err) => {
				if (err) {
					console.log(err);
				}
			});
			return { res, answer: 'sorry, could you please repeat that again?' };
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
