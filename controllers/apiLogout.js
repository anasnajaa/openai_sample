
module.exports = (req, res, next) => {
    res.clearCookie("token");
    res.clearCookie("key");
    res.status(200).json({ message: 'تم تسجيل الخروج' })
}