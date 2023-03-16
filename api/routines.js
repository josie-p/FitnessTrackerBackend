const express = require('express');
const router = express.Router();
const { getAllRoutines, createRoutine, getRoutineById, updateRoutine} = require("../db");
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
router.patch("/:routineId", requireUser, async(req, res, next) =>{
    const { isPublic, name, goal } = req.body;
    const { routineId } = req.params;
    const { id, username } = req.user;
    const fields = {};
    
    if(name){
        fields.name = name;
    }
    if(goal){
        fields.goal = goal;
    }
    if(!isPublic || isPublic){          //handles if isPublic is true or false! (wouldnt add to body when false b4)
        fields.isPublic = isPublic;
    }

    try{
        const findRoutine = await getRoutineById(routineId);
        if( findRoutine.creatorId !== id){
            res.status(403)
            next({
                message: `User ${username} is not allowed to update ${findRoutine.name}`,
                name: "LoggedInError",
                error: "You need to log in"
            }); 
        }

        const updatedRoutine = await updateRoutine({id, ...fields});
        res.send(updatedRoutine);
    } catch ({ name, error, message }){
        next({ name, error, message })
    }

})

// DELETE /api/routines/:routineId

// POST /api/routines/:routineId/activities

module.exports = router;
