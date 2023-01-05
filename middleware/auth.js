const { decrypt } = require('../util/crypto');
exports.isLoggedIn = (req, res, next) => {
    try {
        if (req.cookies.key && req.cookies.token) {
            const user = decrypt({
                iv: req.cookies.key,
                content: req.cookies.token
            });

            if (user === process.env.USER_NAME) {
                req.user = user;
                next();
            }
        } else {
            res.clearCookie("token");
            res.clearCookie("key");
            res.redirect("/");
        }
    } catch (err) {
        res.clearCookie("token");
        res.clearCookie("key");
        res.redirect("/");
    }
}

exports.userIfExist = (req, res, next) => {
    try {
        if (req.cookies.key && req.cookies.token) {
            const user = decrypt({
                iv: req.cookies.key,
                content: req.cookies.token
            });

            if (user === process.env.USER_NAME) {
                req.user = user;
                next();
            }
        } else {
            req.user = null;
            next();
        }
    } catch (err) {
        req.user = null;
        next();
    }
}