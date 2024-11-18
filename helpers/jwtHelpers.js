const jwt = require('jsonwebtoken');

const createToken = (
    payload,
    secret,
) => {
    return jwt.sign(payload, secret);
};

const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};

exports.jwtHelpers = {
    createToken,
    verifyToken
}