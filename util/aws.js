require("dotenv").config();
require("es6-promise").polyfill();
require("isomorphic-fetch");

const path = require("path");
const AWS = require("aws-sdk");
const uuid = require("uuid");

exports.uploadFile = async (req, res, next) => {
    try {
        const { type } = req.query;

        if (type !== "image")
            return res
                .status(422)
                .json({ title: "Invalid Type", message: "Invalid File Type", type: "danger" });

        if (req.files.file.size > 5 * 1024 * 1024) {
            return res
                .status(422)
                .json({ title: "Image Size is too large", message: "Image size should not exceed 2 MB", type: "danger" });
        }

        AWS.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
            region: process.env.S3_BUCKET_REGION
        });

        const s3 = new AWS.S3();
        const fileContent = Buffer.from(req.files.file.data, "binary");

        const ext = path.extname(req.files.file.name);

        const today = new Date();
        const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${type}/${uuid.v4()}${ext}`,
            Body: fileContent,
            ACL: 'public-read',
            CacheControl: 'max-age=31536000',
            Expires: oneYearLater
        };

        s3.upload(params, (err, data) => {
            if (err) { next(err); return; }
            return res.status(200).json({
                title: "File Uploaded",
                message: "File uploaded successfully",
                type: "success",
                file: {
                    name: data.key.replace("image/", ""),
                    url: data.Location
                },
                data
            });
        });
    } catch (err) {
        next(err);
    }
};

exports.uploadUrl = async (url) => {
    try {

        const response = await fetch(url);

        const blob = await response.blob();

        const arrayBuffer = await blob.arrayBuffer();

        const fileContent = Buffer.from(arrayBuffer);

        AWS.config.update({
            accessKeyId: process.env.S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.S3_ACCESS_SECRET_KEY,
            region: process.env.S3_BUCKET_REGION
        });

        const s3 = new AWS.S3();

        const today = new Date();
        const oneYearLater = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `openai/${uuid.v4()}.png`,
            Body: fileContent,
            ACL: 'public-read',
            CacheControl: 'max-age=31536000',
            Expires: oneYearLater
        };

        const data = await s3.upload(params).promise();

        return {
            file: {
                name: data.key.replace("openai/", ""),
                url: data.Location
            },
            data
        };
    } catch (err) {
        console.log(err);
        return null;
    }
};