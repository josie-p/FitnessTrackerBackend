const express = require("express");
const router = express.Router();
const {
  getAllRoutines,
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require("../db");
const { requireUser } = require("./utils");
// GET /api/routines
router.get("/", async (req, res, next) => {
  try {
    const routines = await getAllRoutines();

    res.send(routines);
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

// POST /api/routines
router.post("/", requireUser, async (req, res, next) => {
  const { name, goal, isPublic } = req.body;
  const { id } = req.user;

  try {
    const newRoutine = await createRoutine({
      creatorId: id,
      isPublic: isPublic,
      name: name,
      goal: goal,
    });
    res.send(newRoutine);
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

// PATCH /api/routines/:routineId
router.patch("/:routineId", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { routineId } = req.params;
  const { id, username } = req.user;
  const fields = {};

  if (name) {
    fields.name = name;
  }
  if (goal) {
    fields.goal = goal;
  }
  if (!isPublic || isPublic) {
    //handles if isPublic is true or false! (wouldnt add to body when false b4)
    fields.isPublic = isPublic;
  }

  try {
    const findRoutine = await getRoutineById(routineId);
    if (findRoutine.creatorId !== id) {
      res.status(403);
      next({
        message: `User ${username} is not allowed to update ${findRoutine.name}`,
        name: "LoggedInError",
        error: "You need to log in",
      });
    }

    const updatedRoutine = await updateRoutine({ id: id, ...fields });
    res.send(updatedRoutine);
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

// DELETE /api/routines/:routineId
router.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { id, username } = req.user;

  try {
    const findRoutine = await getRoutineById(routineId);
    if (findRoutine.creatorId !== id) {
      res.status(403);
      next({
        message: `User ${username} is not allowed to delete ${findRoutine.name}`,
        name: "DeleteError",
        error: "You must be the owner of this object to delete it",
      });
    } else {
      const deletedRoutine = await destroyRoutine(routineId);

      res.send(deletedRoutine);
    }
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

// POST /api/routines/:routineId/activities
router.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;

  const { activityId, count, duration } = req.body;

  try {
    const checkDuplicates = await getRoutineActivitiesByRoutine({
      id: routineId,
    });

    if (
      checkDuplicates.length &&
      checkDuplicates[0].activityId === activityId
    ) {
      next({
        error: "You may not have duplicates",
        name: "NoDuplicatesError",
        message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`,
      });
    } else {
      const addActivity = await addActivityToRoutine({
        routineId: routineId,
        activityId: activityId,
        count: count,
        duration: duration,
      });
      res.send(addActivity);
    }
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

module.exports = router;
