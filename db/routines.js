/* eslint-disable no-useless-catch */
const client = require("./client");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try{
    const {rows: [routine]} = await client.query(`
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `, [creatorId, isPublic, name, goal]);

    return routine;
  } catch(error){
    throw error
  }
}

async function getRoutineById(id) {

  try{
    const { rows: [routine] } = await client.query(`
    SELECT *
    FROM routines
    WHERE id = $1;`, [id]);
    console.log(routine, "routine from getRoutineById");
    return routine;
  }catch(error){
 throw error;
  }

}

async function getRoutinesWithoutActivities() {
  try{
    const { rows } = await client.query(`
    SELECT id, "creatorId", "isPublic"
    FROM routines;
    `)

    return rows;
  }catch(error){
    throw error;
  }
}

async function getAllRoutines() {}

async function getAllPublicRoutines() {}

async function getAllRoutinesByUser({ username }) {}

async function getPublicRoutinesByUser({ username }) {}

async function getPublicRoutinesByActivity({ id }) {}

async function updateRoutine({ id, ...fields }) {}

async function destroyRoutine(id) {}

module.exports = {
  getRoutineById,
  getRoutinesWithoutActivities,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  createRoutine,
  updateRoutine,
  destroyRoutine,
};
