/* eslint-disable no-useless-catch */
const client = require("./client");

//passed all tests 12:00 3/13, do HASH passwords before submitting

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
    
    const { rows: [user] } = await client.query(`
    SELECT id, username, password
    FROM users
    WHERE id = ${ userId };
    `);
    
    if(!user){
      return null
    }

    user.password = "";
    return user;
  } catch (error){
    throw error;
  }

}

async function getUserByUsername(userName) {

 try{
 const { rows : [user] } = await client.query(`
 SELECT username, password
 FROM users
 WHERE username = $1;
 `, [userName]);

 return user;
 }catch(error){
  throw error;
 }
}

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
}
