// eslint-disable-next-line no-unused-vars

function requireUser(req, res, next){
    if(!req.user){
        res.status(401)
        next({
            message: "You must be logged in to perform this action",
            name: "LoggedInError",
            error: "You need to log in"
        });
    }

    next();
}

module.exports = {
    requireUser
}