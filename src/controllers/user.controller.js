exports.allAccess = (req, res) => {
	res.status(200).send({ data: 'empty' });
};

exports.userBoard = (req, res) => {
	res.status(200).send({ data: 'empty' });
};

exports.admin = (req, res) => {
	user_json().then(function (user_count) {
		res.status(200).json({ user_count: user_count });
	});
};
