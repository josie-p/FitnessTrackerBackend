/* eslint-disable no-useless-catch */
const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      INSERT INTO routines ("creatorId", "isPublic", name, goal)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (name) DO NOTHING
      RETURNING *;
    `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
    SELECT *
    FROM routines
    WHERE id = $1;`,
      [id]
    );
    return routine;
  } catch (error) {
    throw error;
  }
}

async function getRoutinesWithoutActivities() {
  try {
    const { rows } = await client.query(`
    SELECT *
    FROM routines;
    `);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines JOIN users ON routines."creatorId" = users.id;
    `);

    return await attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines JOIN users ON routines."creatorId" = users.id
    WHERE routines."isPublic";
    `);

    return await attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines JOIN users ON routines."creatorId" = users.id
    WHERE users.username = $1;
    `,
      [username]
    );

    return await attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines JOIN users ON routines."creatorId" = users.id
    WHERE users.username = $1 AND routines."isPublic";
    `,
      [username]
    );

    return await attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines JOIN users ON routines."creatorId" = users.id
    JOIN routine_activities ON routine_activities."routineId" = routines.id
    WHERE routines."isPublic" AND routine_activities."activityId" = $1;
    `,
      [id]
    );

    return await attachActivitiesToRoutines(rows);
  } catch (error) {
    throw error;
  }
}

async function updateRoutine({ id, ...fields }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      UPDATE routines
      SET ${setString}
      WHERE id = ${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

async function destroyRoutine(id) {
  try {
    // eslint-disable-next-line no-unused-vars
    const {
      rows: [routine_activity],
    } = await client.query(
      `
      DELETE FROM routine_activities
      WHERE "routineId" = $1
      RETURNING *;
    `,
      [id]
    );

    const {
      rows: [routine],
    } = await client.query(
      `
      DELETE FROM routines 
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );

    return routine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getRoutineById: getRoutineById,
  getRoutinesWithoutActivities: getRoutinesWithoutActivities,
  getAllRoutines: getAllRoutines,
  getAllPublicRoutines: getAllPublicRoutines,
  getAllRoutinesByUser: getAllRoutinesByUser,
  getPublicRoutinesByUser: getPublicRoutinesByUser,
  getPublicRoutinesByActivity: getPublicRoutinesByActivity,
  createRoutine: createRoutine,
  updateRoutine: updateRoutine,
  destroyRoutine: destroyRoutine,
};
