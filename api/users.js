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

        const token =jwt.sign(
            {
                username: user.username,
                id: user.id,
            },
            process.env.JWT_SECRET, {
                expiresIn: "1w"
            }
        );

        if(_user){
            next({
                name: "UserExistsError",
                message: "A user by that name already exists"
            });
        }

        const user = await createUser({ username, password });

        res.send({ message: "thank you for signing up!", token });

    }catch({ name, message }){
        next({ name, message });
    }
})

// POST /api/users/login

// GET /api/users/me

// GET /api/users/:username/routines

module.exports = router;
