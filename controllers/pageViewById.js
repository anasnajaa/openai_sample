const { picModel } = require('../models/picture');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = async (req, res, next) => {
    const picture = await picModel.findById(ObjectId(req.params.id)).lean();
    res.render("view-picture", {
        picture,
        layout: "./layouts/default-layout",
    });
}