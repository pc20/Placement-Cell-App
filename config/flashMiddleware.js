// passing flash messages to ejs file by setting it to request.locals
module.exports.setMsg = function (req, res, next) {
    res.locals.flash = {
        success: req.flash("success"),
        error: req.flash("error"),
    };
    next();
};