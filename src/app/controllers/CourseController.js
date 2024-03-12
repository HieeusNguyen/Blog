const { mongooseToObject } = require("../../util/mongoose");
const Course = require("../models/Course");
class CourseController {
    // GET /search
    show(req, res, next) {
        Course.findOne({ slug: req.params.slug })
            .then((course) =>
                res.render("courses/show", { course: mongooseToObject(course) })
            )
            .catch(next);
    }

    // GET /create
    create(req, res, next) {
        res.render("courses/create");
    }

    // POST /store
    store(req, res, next) {
        const formData = req.body;
        formData.image = "https://i.ytimg.com/vi/${formData.videoId}/hq720.jpg";
        const course = new Course(formData);
        course
            .save()
            .then(() => res.redirect("/"))
            .catch(next);
    }
}

module.exports = new CourseController();
