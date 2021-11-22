const {verifyToken} = require('../utils/jwt');

module.exports = async (request, response, next) => {
	let jwtAccessToken = request.headers.authorization;
	const ACCESS_SECRET_KEY = process.env.JWT_ACCESS_TOKEN_SECRET_KEY;

	if (jwtAccessToken) {
		jwtAccessToken = jwtAccessToken.replace('Bearer ', '');
	}
	try {
		response.locals.account = await verifyToken(jwtAccessToken, ACCESS_SECRET_KEY);
		return next();
	} catch (error) {
		let { message } = error;
		return response.status(401).json({ message });
	}
};