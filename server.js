require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");

const { isLoggedIn, userIfExist } = require('./middleware/auth');
const { picModel } = require('./models/picture');


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
    // apis
    app.post("/api/login", require('./controllers/apiLogin'));
    app.post("/api/logout", require('./controllers/apiLogout'));
    app.post("/api/generate", isLoggedIn, require('./controllers/apiGenerate'));

    // pages
    app.get("/", userIfExist, require('./controllers/pageIndex'));
    app.get("/random-picture", userIfExist, require('./controllers/pageRandomPicture'));

    app.get("/view/:id", isLoggedIn, require('./controllers/pageViewById'));
    app.get("/dashboard", isLoggedIn, require('./controllers/pageDashboard'));
    app.get("/prompt", isLoggedIn, require('./controllers/pagePrompt'));
    app.get("/about", isLoggedIn, require('./controllers/pageAbout'));



    app.listen(process.env.PORT || "80", () => {
        console.log("Server started on: " + process.env.PORT);
    });
});