const express = require('express');
const router = express.Router();
const { requireUser } = require('./utils');

const {
    updateRoutineActivity,
    canEditRoutineActivity,
    getRoutineById,
    getRoutineActivityById,
    destroyRoutineActivity
} = require("../db");


// PATCH /api/routine_activities/:routineActivityId
router.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const  { routineActivityId } = req.params;
    const { count, duration } = req.body;
    const { id, username } = req.user;

    const fields = {};

    if(count){
        fields.count = count;
    }
    if(duration){
        fields.duration = duration;
    }

    const findRoutineActivityForName = await getRoutineActivityById(routineActivityId); //getting name of routine for error message
    const findName = await getRoutineById(findRoutineActivityForName.routineId);
    const name = findName.name;
   
    try{
        const findRoutineActivity = await canEditRoutineActivity(routineActivityId, id);
      
        if(!findRoutineActivity){
            next({
                name: "UnauthorizedUserError",
                message: `User ${username} is not allowed to update ${name}`,
                error: "Not Creator of Routine_Activity"
            })
        }

        const updatedRoutineActivity = await updateRoutineActivity({id: routineActivityId, ...fields});
        res.send(updatedRoutineActivity);
    } catch({ name, error, message}){
        next({name, error, message});
    }
})

// DELETE /api/routine_activities/:routineActivityId
router.delete("/:routineActivityId", requireUser, async(req, res, next) => {

    const { routineActivityId } = req.params;
    const { id, username } = req.user;
    // console.log(routineActivityId, "id");

    const findRoutineActivityForName = await getRoutineActivityById(routineActivityId);
    const findName = await getRoutineById(findRoutineActivityForName.routineId);
    const name = findName.name;

    try{
        const findRoutineActivity = await canEditRoutineActivity(routineActivityId, id);

        if(!findRoutineActivity){
            res.status(403);
            next({
                name: "UnauthorizedUserError",
                message: `User ${username} is not allowed to delete ${name}`,
                error: "Not creator of this routine_activity"
            })
        }

        const deletedRoutineActivity = await destroyRoutineActivity(routineActivityId);
        res.send(deletedRoutineActivity);

    }catch({name, error, message}){
        next({name, error, message});
    }
})

module.exports = router;
