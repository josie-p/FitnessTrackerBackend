require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const app = express()
const cors = require("cors");

// Setup your Middleware and API Router here

app.use(express.json());

app.use(morgan("dev"));

app.use(cors());

app.use((req, res, next) => {
    console.log("---- Body Logger Start ----");
    console.log(req.body);
    console.log("---- Body Logger End ----");

    next();
})


const apiRouter = require("./api");
app.use("/api", apiRouter);

app.use("*", (req, res) => {
    res.status(404).send({
        error: "404 -- not found",
        message: "no route found for the request url"
    });
})

app.use((error, req, res, next) =>{
    res.send({
        error: error.error,
        name: error.name,
        message: error.message
    });
});

const client  = require("./db/client");
client.connect();

module.exports = app;
