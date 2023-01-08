module.exports = async (req, res, next) => {
    res.render("random-picture", {
        user: req.user || null,
        layout: "./layouts/default-layout",
    });
}