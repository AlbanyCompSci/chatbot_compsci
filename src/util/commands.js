const stringSimilarity = require('string-similarity');
const dbConfig = require('../config/db.config');
const user = require('../models/user.model');
const { spawn } = require('child_process');
const numUtil = require('./numbers');
const readline = require('readline');
const chalk = require('chalk');
const util = require('util');
const os = require('os');

const commands = ['get_user_count', 'db_info', 'clear', 'help', 'exit', 'quit'];

const prompt = () => {
	return new Promise(function (resolve, reject) {
		let rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout,
			terminal: false,
		});
		rl.setPrompt('chatbot> ');
		rl.prompt();
		rl.on('line', function (line) {
			function commandHandler(n) {
				return line.split(' ')[0] === commands[n].split(' ')[0] && commands[n].split(' ')[0].slice(-1) !== '*';
			}

			switch (line) {
				case 'clear':
				case 'cls':
					console.clear();
					break;
				case 'exit':
				case 'quit':
				case 'q':
					rl.close();
					console.log(chalk.green('\nlibquest terminated cleanly.'));
					process.exit();
					break;
				case 'help':
				case '?':
					console.log(
						`chatbot, version 0.1.5-prerelease (${
							os.platform() + os.release()
						})\nThese commands are defined internally. Type 'help' to see this list.` +
							`\n\nA star (*) next to a name means that the command is disabled. \n\n` +
							commands
								.map((item) => `  ${item}`)
								.slice(0, -3)
								.join('\n') +
							'\n  exit|quit'
					);
					break;
				default:
					if (line.trim() === '') {
					} else if (line.length < 20) {
						const matches = stringSimilarity.findBestMatch(line.trim(), commands);
						if (matches.bestMatch.rating == 0) {
							console.log(`Unknown command '${line}'`);
						} else {
							if (matches.bestMatch.target[matches.bestMatch.target.length - 1] === '*') {
								console.log(`Unknown command '${line}'`);
							} else {
								console.log(`Command '${line}' not found, did you mean: ` + matches.bestMatch.target.split(' ')[0] + '?');
							}
						}
					}
					break;
			}
			switch (true) {
				case commandHandler(0):
					user.countDocuments().then(function (user_count) {
						console.log(`Registered users: ${user_count}`);
					});
					break;
				case commandHandler(1):
					console.log(
						`connected to: mongodb+srv://${dbConfig.USERNAME}:${dbConfig.PASSWORD}@${dbConfig.HOST}/${dbConfig.DB}?retryWrites=true&w=majority`
					);
					break;
			}
			setTimeout(function () {
				rl.prompt();
			}, 100);
		}).on('close', function () {
			rl.close();
			console.log(chalk.green('\nlibquest terminated cleanly.'));
			process.exit();
		});
	});
};

module.exports = {
	stdin: prompt,
};
