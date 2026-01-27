const express = require("express");
const app = express();

const routes = require("./routes");

app.use(express.json());
app.use("/uploads", express.static("uploads"));

// API entry
app.use("/api", routes);

module.exports = app;
