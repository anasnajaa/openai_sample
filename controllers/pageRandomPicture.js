const { picModel } = require('../models/picture');

module.exports = async (req, res, next) => {

    const randomPic = await picModel.aggregate([
        { $sample: { size: 1 } }
    ]);

    res.render("random-picture", {
        user: req.user || null,
        picture: randomPic[0],
        layout: "./layouts/default-layout",
    });
}