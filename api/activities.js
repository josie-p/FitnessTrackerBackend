const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");

const { 
    getAllActivities,
    createActivity,
    getActivityByName,
    getActivityById,
    updateActivity
 } = require("../db");

// GET /api/activities/:activityId/routines

// GET /api/activities
router.get("/", async (req, res, next) =>{
    try{
        const allActivities = await getAllActivities();
        res.send( allActivities );
    } catch ({name, error, message}){
        next({name, error, message});
    }
})

// POST /api/activities
router.post("/", requireUser, async (req, res, next) =>{
    const {name, description} = req.body;

    try{
        const checkIfExists = await getActivityByName(name);

        if(checkIfExists){
            next({
                error: "activtyExistsError",
                message: `An activity with name ${name} already exists`,
                name: "Violates unique key constraint (activity name)"
            })
        } else {
            const newActivity = await createActivity({name, description});
            res.send( newActivity );
        }

    } catch({name, error, message}){
        next({name, error, message});
    }
})

// PATCH /api/activities/:activityId
router.patch("/:activityId", requireUser, async (req, res, next) =>{
    const activityId = req.params.activityId;
    const {name, description} = req.body;
    const updateFields = {};

    if(name){
        updateFields.name = name;
    }
    if(description){
        updateFields.description = description;
    }

    try{
        const checkIfExists = await getActivityById(activityId);
        if(!checkIfExists){
            next({
                name: "ActivityId does not correspond with any activity",
                message: `Activity ${activityId} not found`,
                error: "ActivityNotFoundError"
            });
        } 
        
        const checkName = await getActivityByName(name);
        if(checkName){
            next({
                name: "Activity with submitted Name exists already",
                message: `An activity with name ${name} already exists`,
                error: "ActivityAlreadyExistsError"
            });
        } 

        const updatedActivity = await updateActivity({activityId, updateFields});
        console.log(updatedActivity);
        res.send(updatedActivity);
        
    } catch ({name, error, message}){
        next({name, error, message});
    }
})

module.exports = router;
