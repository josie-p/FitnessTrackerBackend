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
    RETURNING id, username;
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
      user.password  = "";
      return user;
    }
  }catch(error){
    throw error;
  }

}

async function getUserById(userId) {
  try{

    
    console.log(userId, "this is userId");
    
    const { rows: [user] } = await client.query(`
    SELECT id, username, password
    FROM users
    WHERE id = ${ userId };
    `);
    
    if(!user){
      return null
    }

    console.log(user, "this is user");
    user.password = "";
    return user;
  } catch (error){
    throw error;
  }

}

async function getUserByUsername(userName) {

}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
