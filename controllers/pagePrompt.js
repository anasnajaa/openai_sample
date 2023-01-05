module.exports = async (req, res, next) => {
    res.render("add-picture", {
        user: req.user || null,
        layout: "./layouts/default-layout",
    });
}