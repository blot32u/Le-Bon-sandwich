require('crypto').randomBytes(64).toString('hex');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');

// get config vars
dotenv.config();

// access config var
process.env.TOKEN_SECRET;



const generateAccessToken = function generateAccessToken(string) {
return jwt.sign(string, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}
module.exports = generateAccessToken;