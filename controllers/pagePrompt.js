module.exports = async (req, res, next) => {
    res.render("add-picture", {
        layout: "./layouts/default-layout",
    });
}