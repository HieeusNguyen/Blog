const jwt = require("jsonwebtoken");

class UserMiddlewares {
    verifyToken(req, res, next) {
        const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, "secretKey", (err, user) => {
                if (err) {
                    res.status(403).json("Token is not valid");
                }
                req.user = user;
                next();
            });
        } else {
            res.status(401).json("You are not authenticated");
        }
    }

    verifyTokenAndAdminAuth(req, res, next) {
        UserMiddlewares.verifyToken(req, res, () => {
            if (req.user.id == req.params.id || req.user.admin) {
                next();
            } else {
                res.status(403).json("You are not allowed to delete other");
            }
        });
    }
}

module.exports = new UserMiddlewares();
