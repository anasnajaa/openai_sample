module.exports = async (req, res, next) => {
    res.render("index", {
        user: req.user || null,
        layout: "./layouts/default-layout",
    });
}