const { picModel } = require('../models/picture');

module.exports = async (req, res, next) => {
    const pics = await picModel.find({}).lean();
    res.render("dashboard", {
        layout: "./layouts/default-layout",
        pics
    });
}