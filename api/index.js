const express = require('express');
const router = express.Router();
const app = require("../app");

//jwt:
const jwt = require("jsonwebtoken");
const { getUserById} = require("../db");
const { JWT_SECRET } = process.env;

router.use(async (req, res, next) => {
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    if(!auth){
        // res.sendStatus(401);
        next();
    }else if(auth.startsWith(prefix)){
        const token = auth.slice(prefix.length);


        try{
            const { id } = jwt.verify(token, JWT_SECRET);
            if(id){
                req.user = await getUserById(id);
                next();
            }

        }catch({ name, message }){
            next({ name, message })
        }
    }else{
        next({
            name: "AuthorizationHeaderError",
            message: `Authorization token must start with ${prefix}`,
        });
    }

})

router.use((req, res, next) => {
    if(req.user){
        console.log("User is set:", req.user);
    }

    next();
})

// GET /api/health
router.get('/health', async (req, res) => {
    res.send({
        message: "Server is healthy!",
    });
});

// ROUTER: /api/users
const usersRouter = require('./users');
router.use('/users', usersRouter);

// ROUTER: /api/activities
const activitiesRouter = require('./activities');
router.use('/activities', activitiesRouter);

// ROUTER: /api/routines
const routinesRouter = require('./routines');
router.use('/routines', routinesRouter);

// ROUTER: /api/routine_activities
const routineActivitiesRouter = require('./routineActivities');
router.use('/routine_activities', routineActivitiesRouter);



module.exports = router;
