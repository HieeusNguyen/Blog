class NewsControllers {
    index(req, res) {
        // [GET] / news
        res.render('news');
    }

    // GET / news/:slug
    show(req, res) {
        res.send('NEW DETAIL!');
    }
}

module.exports = new NewsControllers();
