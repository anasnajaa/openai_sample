require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const cookieParser = require("cookie-parser");

const { isLoggedIn } = require('./middleware/auth');
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

    app.post("/api/login", require('./controllers/apiLogin'));

    app.post("/api/generate", isLoggedIn, require('./controllers/apiGenerate'));

    app.get("/", require('./controllers/pageIndex'));

    app.get("/view/:id", isLoggedIn, require('./controllers/pageViewById'));

    app.get("/dashboard", isLoggedIn, require('./controllers/pageDashboard'));

    app.get("/prompt", isLoggedIn, require('./controllers/pagePrompt'));

    app.listen(process.env.PORT || "80", () => {
        console.log("Server started on: " + process.env.PORT);
    });
});