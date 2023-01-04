require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Configuration, OpenAIApi } = require("openai");
const { encrypt } = require('./util/crypto');
const { isLoggedIn } = require('./middleware/auth');
const { picModel } = require('./models/picture');
const ObjectId = require('mongoose').Types.ObjectId;

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
const mongodbUri = process.env.MONGODB_URI
const app = express();



app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);

mongoose.set('strictQuery', false);
mongoose.connect(mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const connection = mongoose.connection;

connection.once("open", async () => {

    const configuration = new Configuration({
        organization: process.env.OPENAI_ORG,
        apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    app.post("/api/login", async (req, res, next) => {
        try {
            if (req.body.username === username &&
                req.body.password === password) {
                const enc = encrypt(req.body.username);
                res.cookie("token", enc.content);
                res.cookie("key", enc.iv);
                res.status(200).json({ message: "ok" });
                return;
            }
            res.status(400).json({ message: "خطأ في اسم المستخدم او كلمة المرور" });
        } catch (err) {
            res.status(400).json({ message: "خطأ في اسم المستخدم او كلمة المرور" });
        }
    });

    app.post("/api/generate", isLoggedIn, async (req, res, next) => {
        const response = await openai.createImage({
            prompt: req.body.prompt,
            n: 2,
            size: "1024x1024"
        });

        const addPic = await picModel({
            prompt: req.body.prompt,
            pictures: response.data.data,
            answers: req.body.answers
        }).save();

        res.status(200).json({
            message: 'تم اضافة الصورة',
            id: addPic._id
        })
    });

    app.get("/", async (req, res, next) => {

        res.render("index", {
            layout: "./layouts/default-layout",
        });
    });

    app.get("/view/:id", async (req, res, next) => {
        const picture = await picModel.findById(ObjectId(req.params.id)).lean();
        res.render("view-picture", {
            picture,
            layout: "./layouts/default-layout",
        });
    });

    app.get("/dashboard", isLoggedIn, async (req, res, next) => {
        const pics = await picModel.find({}).lean();
        res.render("dashboard", {
            layout: "./layouts/default-layout",
            pics
        });
    });

    app.get("/prompt", isLoggedIn, async (req, res, next) => {
        res.render("add-picture", {
            layout: "./layouts/default-layout",
        });
    });

    app.get("/prompt", isLoggedIn, async (req, res, next) => {
        res.render("image-results", {
            layout: "./layouts/default-layout",
        });
    });


    app.listen(process.env.PORT || "80", () => {
        console.log("Server started on: " + process.env.PORT);
    });
});