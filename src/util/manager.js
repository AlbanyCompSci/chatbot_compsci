const { NlpManager } = require('node-nlp');
const manager = new NlpManager({ languages: ['en'] });
const fs = require('fs');
const files = fs.readdirSync('./intents').filter(function (file) {
	if (file !== 'generic.res.json') return file;
});

function nth(n) {
	return ['st', 'nd', 'rd'][((((n + 90) % 100) - 10) % 10) - 1] || 'th';
}

const add_generic = () => {
	let data = fs.readFileSync(`./intents/generic.res.json`);
	JSON.parse(data).responses.map((item) => {
		item.questions.map((question) => {
			manager.addDocument('en', question, item.intent);
		});
		item.answers.map((answer) => {
			manager.addAnswer('en', item.intent, answer);
		});
	});
};

const add_js_replies = () => {
	['what day is it', 'whats today', 'what is today'].map((question) => {
		manager.addDocument('en', question, 'date');
		manager.addAnswer(
			'en',
			'date',
			`It is ${new Date().toLocaleString('default', { weekday: 'long', timeZone: 'America/Los_Angeles' })}, ${new Date().toLocaleString('default', {
				month: 'long',
				timeZone: 'America/Los_Angeles',
			})} ${new Date().getDate() - 1}${nth(parseInt(new Date().getDate() - 1))}, ${new Date().getFullYear()}`
		);
	});
};

for (const file of files) {
	let data = fs.readFileSync(`./intents/${file}`);
	data = JSON.parse(data);
	const intent = file.replace('.res.json', '');
	for (const question of data.questions) {
		manager.addDocument('en', question, intent);
	}
	for (const answer of data.answers) {
		manager.addAnswer('en', intent, answer);
	}
}

async function train_save() {
	await manager.train();
	manager.save();
}

add_generic();
add_js_replies();
train_save();
