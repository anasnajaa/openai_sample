module.exports = async (req, res, next) => {
    res.render("index", {
        layout: "./layouts/default-layout",
    });
}