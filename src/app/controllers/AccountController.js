const { mutipleMongooseToObject } = require("../../util/mongoose");
const User = require("../models/User");
class AccountController {
    login(req, res) {
        // [GET] / login
        res.render("account/login");
    }
    register(req, res) {
        res.render("account/register");
    }
}

module.exports = new AccountController();
