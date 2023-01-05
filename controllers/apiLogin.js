const { encrypt } = require('../util/crypto');
const username = process.env.USER_NAME;
const password = process.env.PASSWORD;

module.exports = async (req, res, next) => {
    try {
        if (req.body.username === username &&
            req.body.password === password) {
            const enc = encrypt(req.body.username);
            res.cookie("token", enc.content);
            res.cookie("key", enc.iv);
            res.status(200).json({ message: "ok" });
        } else {
            res.status(400).json({ message: "خطأ في اسم المستخدم او كلمة المرور" });
        }
    } catch (err) {
        res.status(400).json({ message: "خطأ في اسم المستخدم او كلمة المرور" });
    }
}