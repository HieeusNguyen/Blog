const token = require("../../util/token");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];
class AuthController {
    async register(req, res, next) {
        // [POST] /
        //Hash
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashed,
        });

        //Save to DB
        newUser
            .save()
            .then(() => res.send("Successfully Register"))
            .catch(next);
    }

    async login(req, res) {
        try {
            // Validate username and password presence (example)
            if (!req.body.username || !req.body.password) {
                return res
                    .status(400)
                    .json({ message: "Missing username or password" });
            }

            // Find user by username
            const user = await User.findOne({ username: req.body.username });

            if (!user) {
                return res.status(401).json({ message: "Username not found" });
            }

            // Validate password
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                return res.status(401).json({ message: "Invalid password" });
            }

            // Login successful (replace with session management or token generation)
            if (user && validPassword) {
                const accessToken = token.accessToken(user);
                const refreshToken = token.refreshToken(user);
                refreshTokens.push(refreshToken);
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                });
                const { password, ...others } = user._doc;
                res.status(200).json({
                    message: "Login successful",
                    token: accessToken,
                    refreshTokens: refreshTokens
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Internal server error" });
        }
    }

    requestRefreshToken(req, res) {
        //REDIS
        const refreshToken = req.cookies.refreshToken;
        //Send error if token is not valid
        if (!refreshToken)
            return res.status(401).json("You're not authenticated");
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({message: "Refresh token is not valid", array: refreshTokens});
        }
        jwt.verify(refreshToken, "secretKey", (err, user) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ message: "Internal server error" });
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

            //Create new access Token, refresh Token
            const newAccessToken = token.accessToken(user);
            const newRefreshToken = token.refreshToken(user);

            refreshTokens.push(newRefreshToken);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({ accessToken: newAccessToken });
        });
    }

    logout(req, res) {
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(
            (token) => token !== req.cookies.refreshToken
        );
        res.status(200).json("Logged out!");
    }
}

module.exports = new AuthController();
