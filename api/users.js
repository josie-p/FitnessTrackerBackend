/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  createUser,
  getUser,
  getUserByUsername,
  getPublicRoutinesByUser,
  getAllRoutinesByUser,
} = require("../db");
const { requireUser } = require("./utils");

// POST /api/users/register
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        error: "User Exists!",
        message: `User ${username} is already taken.`,
        name: "UserExistsError",
      });
    }
    if (password.length < 8) {
      next({
        error: "ShortPasswordError",
        message: "Password Too Short!",
        name: "Needs to be 8 Char",
      });
    }

    const user = await createUser({ username, password });

    const token = jwt.sign(
      {
        username: user.username,
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );

    res.send({
      message: "thank you for signing up!",
      token: token,
      user: user,
    });
  } catch ({ error, message, name }) {
    next({ error, message, name });
  }
});

// POST /api/users/login
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    next({
      error: "MissingUsernameOrPasswordError",
      name: "MissingCredentialsError",
      message: "You are have not input your username and/or password",
    });
  }

  const _user = await getUser({ username, password });

  if (!_user) {
    next({
      error: "InvalidCredentialsError",
      name: "IncorrectUsernameOrPassword",
      message: "Your username/password is incorrect",
    });
  }

  try {
    const user = await getUserByUsername(username);

    const token = jwt.sign(
      {
        username: user.username,
        id: user.id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.send({
      token: token,
      user: {
        id: user.id,
        username: user.username,
      },
      message: "you're logged in!",
    });
  } catch ({ error, name, message }) {
    next({ error, name, message });
  }
});

// GET /api/users/me
router.get("/me", requireUser, async (req, res, next) => {
  const id = req.user.id;
  const username = req.user.username;

  try {
    res.send({
      id: id,
      username: username,
    });
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

// GET /api/users/:username/routines
router.get("/:username/routines", requireUser, async (req, res, next) => {
  const { username } = req.params;
  const user = req.user.username;
  try {
    if (user === username) {
      const getPersonalRoutines = await getAllRoutinesByUser({ username });
      res.send(getPersonalRoutines);
    } else {
      const publicRoutines = await getPublicRoutinesByUser({ username });
      res.send(publicRoutines);
    }
  } catch ({ name, error, message }) {
    next({ name, error, message });
  }
});

module.exports = router;
