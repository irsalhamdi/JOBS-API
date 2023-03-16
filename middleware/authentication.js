const user = require('../models/User');
const jwt = require('jsonwebtoken');
const {UnauthenticatedError} = require('../errors');

const auth = async(req, res, next) => {
    const authHeaders = req.headers.authorization;

    if(!authHeaders || !authHeaders.startsWith('Bearer')){
        throw new UnauthenticatedError('Authentication invalid');
    }

    const token = authHeaders.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const testUser = payload.userId === '6412d16c8be7ac2371a01c5f';
        req.user = {userId: payload.userId, testUser};
        next();
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }
}

module.exports = auth;