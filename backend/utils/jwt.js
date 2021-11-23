const jwt = require('jsonwebtoken');

const verifyToken = (jwtToken, jwtSecretKey, ignoreExpiration = false) => {
	return new Promise((resolve, reject) => {
		jwt.verify(jwtToken, jwtSecretKey, { ignoreExpiration }, (error, decoded) => {
			if (error) {
				return reject(error);
			}
			console.log('decode', decoded);
			return resolve(decoded);
		});
	});
};

const generateToken = (jwtPayload, jwtSecretKey, jwtExp) => {
	return new Promise((resolve, reject) => {
		jwt.sign(jwtPayload, jwtSecretKey, { expiresIn: jwtExp }, (error, token) => {
			if (error) {
				return reject(error);
			}
			return resolve(token);
		});
	});
};

module.exports = { verifyToken, generateToken };