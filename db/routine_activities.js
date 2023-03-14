/* eslint-disable no-useless-catch */
const client = require("./client");

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
  try{
    const { rows : [routine_activity]} = await client.query(`
      INSERT INTO routine_activities("routineId", "activityId", count, duration)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT ("routineId", "activityId") DO NOTHING
      RETURNING *;
    `, [routineId, activityId, count, duration]);

    return routine_activity;
  } catch(error){
    throw error
  }
}

async function getRoutineActivityById(id) {
  try{
    const { rows: [routineActivity] } = await client.query(
      `SELECT *
        FROM routine_activities
        WHERE id = $1;`
    , [id]);

    return routineActivity;
  }catch(error){
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({ id }) {}

async function updateRoutineActivity({ id, ...fields }) {

  const setString = Object.keys(fields).map((key, index) => `"${key}"=$${index + 1}`)
  .join(", ");

  if(setString.length === 0){
    return;
  }

  try{
    const { rows: [routineActivity] } = await client.query(`
    UPDATE routine_activities
    SET ${setString}
    WHERE id = ${id}
    RETURNING *;
    `, Object.values(fields));

    return routineActivity;
  }catch(error){
    throw error;
  }
}

async function destroyRoutineActivity(id) {

  try{
    const { rows : [activity_routine] } = await client.query(`
    DELETE FROM routine_activities
    WHERE "routineId" = ${id};
    `);

   console.log(activity_routine, "activity routine");

    return activity_routine;
  }catch(error){
    throw error;
  }

}

async function canEditRoutineActivity(routineActivityId, userId) {}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
