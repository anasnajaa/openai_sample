require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(expressLayouts);

const configuration = new Configuration({
    organization: process.env.OPENAI_ORG,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

app.get("/", async (req, res, next) => {
    res.render("index", {
        layout: "./layouts/default-layout",
    });
});

app.get("/generate", async (req, res, next) => {
    const response = await openai.createImage({
        prompt: req.query.prompt,
        n: 2,
        size: "1024x1024"
    });

    res.render("image-results", {
        layout: "./layouts/default-layout",
        images: response.data
    });
});


app.listen(process.env.PORT || "80", () => {
    console.log("Server started on: " + process.env.PORT);
});