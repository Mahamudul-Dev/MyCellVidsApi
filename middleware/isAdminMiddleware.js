const jwt = require('jsonwebtoken');

const JWT_SECRET_KEY = "secret123";

module.exports.isAdminMiddleware = (req, res, next) => {

    try {
        let token = req.headers.authorization;
        if (token) {
            token = token.split(" ")[1];
            let user = jwt.verify(token, JWT_SECRET_KEY);
            console.log(user)
            if (user.role = "admin") {
                next();
            }
            else {
                res.status(401).json({
                    message: 'Unauthorized! Please authenticate'
                })
            }
        }
        else {
            req.status(401).json({
                message: 'Unauthorized! Please authenticate'
            })
        }

        next();

    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized! Please authenticate',
            error
        });
    }
};
