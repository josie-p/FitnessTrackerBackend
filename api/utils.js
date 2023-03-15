// eslint-disable-next-line no-unused-vars
const express = require("express");

function requireUser(req, res, next){
    if(!req.user){
        next({
            message: "You must be logged in to perform this action",
            error: "Missing User",
            name: "MissingUserError",
        }, res.sendStatus(401));
    }

    next();
}

module.exports = {
    requireUser
}