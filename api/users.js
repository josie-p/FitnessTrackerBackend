/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { createUser, getUser, getUserByUsername } = require("../db");

// POST /api/users/register
router.post("/register", async(req, res, next) => {
    const { username, password } = req.body;

    try{
        const _user = await getUserByUsername(username);

        if(_user){
            next({
                error: "User Exists!",
                message: `User ${username} is already taken.`,
                name: "UserExistsError"
            });
        }
        if(password.length < 8){
            next({
                error:"ShortPasswordError",
                message: "Password Too Short!",
                name: "Needs to be 8 Char"
            })
        }
        
        const user = await createUser({ username, password });

        const token =jwt.sign(
            {
                username: user.username,
                id: user.id,
            },
            process.env.JWT_SECRET, {
                expiresIn: "1w"
            }
        );

        res.send({ "message": "thank you for signing up!", "token": token, "user": user });

    }catch({ error, message, name }){
        next({ error, message, name });
    }
})

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
