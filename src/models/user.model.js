const mongoose = require('mongoose');
const User = mongoose.model(
	'User',
	new mongoose.Schema({
		username: String,
		email: String,
		password: String,
		isUser: String,
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Role',
			},
		],
	})
);

global.user_json = async function getMap() {
	const json = await User.find({});
	const count = await User.find().countDocuments();
	return { user_count: count, data: json };
};

module.exports = User;
