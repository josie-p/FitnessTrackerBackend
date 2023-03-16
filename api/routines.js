const express = require('express');
const router = express.Router();
const { getAllRoutines, createRoutine} = require("../db");
const { requireUser } = require('./utils');
// GET /api/routines
router.get("/", async(req, res, next) => {
    try{
        const routines = await getAllRoutines();

        res.send(routines);
    }catch({name, error, message}){
        next({name, error, message});
    }
})

// POST /api/routines
router.post("/", requireUser, async(req, res, next) => {
    const { name, goal, isPublic} = req.body;
    const { id } = req.user;

    try{
        const newRoutine = await createRoutine({creatorId: id, isPublic: isPublic, name: name, goal: goal});
        res.send(newRoutine)
    }catch({name, error, message}){
        next({name, error, message});
    }
})

// PATCH /api/routines/:routineId

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
