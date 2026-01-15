const express = require("express");
const app = express();

const routes = require("./routes");

app.use(express.json());

// API entry
app.use("/api", routes);

module.exports = app;
