const { decrypt } = require('../util/crypto');
exports.isLoggedIn = (req, res, next) => {
    try {
        const user = decrypt({
            iv: req.cookies.key,
            content: req.cookies.token
        });

        if (user === process.env.USER_NAME) {
            next();
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