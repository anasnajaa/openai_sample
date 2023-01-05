const { Configuration, OpenAIApi } = require("openai");
const { uploadUrl } = require('../util/aws');
const { picModel } = require('../models/picture');

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

module.exports = async (req, res, next) => {
    const response = await openai.createImage({
        prompt: req.body.prompt,
        n: 2,
        size: "1024x1024"
    });

    let pics = [];

    for (let i = 0; i < response.data.data.length; i++) {
        const uploadRes = await uploadUrl(response.data.data[i].url);
        pics.push({
            url: uploadRes.file.url
        });
    }

    const addPic = await picModel({
        prompt: req.body.prompt,
        pictures: pics,
        answers: req.body.answers
    }).save();

    res.status(200).json({
        message: 'تم اضافة الصورة',
        id: addPic._id
    })
}