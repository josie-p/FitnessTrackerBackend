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

async function getRoutineActivitiesByRoutine({ id }) {

  try{
    const { rows } = await client.query(`
    SELECT *
    FROM routine_activities
    WHERE "routineId" =  $1;
    `, [id]);


    return rows;
  }catch(error){
    throw error;
  }

}

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
    WHERE id = ${id}
    RETURNING *;
    `);

    return activity_routine;
  }catch(error){
    throw error;
  }

}

async function canEditRoutineActivity(routineActivityId, userId) {
  try{
    const { rows: [routine_activity] } = await client.query(`
    SELECT routine_activities.*, routines."creatorId"
    FROM routine_activities JOIN routines ON routines.id = routine_activities."routineId"
    WHERE routine_activities.id = $1 AND routines."creatorId" = $2
    `, [routineActivityId, userId]);

    return routine_activity;
  }catch(error){
    throw error;
  }
}

module.exports = {
  getRoutineActivityById,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  canEditRoutineActivity,
};
