const { mutipleMongooseToObject } = require("../../util/mongoose");
const User = require("../models/User");
class AccountController {
    login(req, res) {
        // [GET] / login
        res.render("login");
    }

}

module.exports = new AccountController();
