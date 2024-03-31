const { mutipleMongooseToObject } = require("../../util/mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
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
            return res.status(400).json({ message: 'Missing username or password' });
          }
      
          // Find user by username
          const user = await User.findOne({ username: req.body.username });
      
          if (!user) {
            return res.status(401).json({ message: 'Username not found' });
          }
      
          // Validate password
          const validPassword = await bcrypt.compare(req.body.password, user.password);
      
          if (!validPassword) {
            return res.status(401).json({ message: 'Invalid password' });
          }
      
          // Login successful (replace with session management or token generation)
          res.status(200).json({ message: 'Login successful' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Internal server error' });
        }
      }
}

module.exports = new AuthController();
