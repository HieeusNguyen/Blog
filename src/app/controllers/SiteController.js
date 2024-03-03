const Course = require("../models/Course");
class SiteController {
    index(req, res, next) {
        // [GET] /
        // res.render('home');
        Course.find({})
            .then((course) => res.render("home"))
            .catch(next);
    }

    // GET /search
    search(req, res) {
        res.render("search");
    }
}

module.exports = new SiteController();
