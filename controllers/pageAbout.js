module.exports = async (req, res, next) => {
    res.render("about", {
        user: req.user || null,
        layout: "./layouts/default-layout"
    });
}