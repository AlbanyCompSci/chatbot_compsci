const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
manager.load();

generateChatReply = async (query) => {
	return await manager.process('en', query);
};

const chatbot = {
	generateChatReply,
};

module.exports = chatbot;
