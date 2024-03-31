const newsRouter = require("./news");
const siteRouter = require("./site");
const courseRouter = require("./course");
const meRouter = require("./me");
const authRouter = require("./auth")

function route(app) {
    app.use("/auth", authRouter)
    app.use("/news", newsRouter);
    app.use("/courses", courseRouter);
    app.use("/me", meRouter);
    app.use("/", siteRouter);
}

module.exports = route;
