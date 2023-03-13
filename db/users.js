/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions

// user functions
async function createUser({ username, password }) {
  // eslint-disable-next-line no-useless-catch
  try{
    const {rows: [user]} = await client.query(`
    INSERT INTO users (username, password)
    VALUES ($1, $2)
    ON CONFLICT (username) DO NOTHING
    RETURNING username;
    `, [username, password]);
    return user;
  } catch(error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try{

    const { rows: [user] } = await client.query(`
    SELECT username, password
    FROM users 
    WHERE username=$1 AND password=$2;
    `, [username, password]);

    if(user === undefined){
      return;
    }else{
      console.log(user.username, "user in else");
      user.password  = "";
      return user;
    }
  }catch(error){
    throw error;
  }

}

async function getUserById(userId) {

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
