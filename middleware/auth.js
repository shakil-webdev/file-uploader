const { jwtHelpers } = require("../helpers/jwtHelpers");

exports.auth = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        
        const verified = jwtHelpers.verifyToken(token, process.env.JWT_SECRET)

        if (!verified) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: 'You are not authorized'
            })
        }

        next()
    } catch (error) {
        res.status(401).json(
            {
                status: 401,
                success: false,
                message: 'You are not authorized',
                error: error.message
            }
        );
    }
}
