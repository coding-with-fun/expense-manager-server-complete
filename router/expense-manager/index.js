/**
 * @author Coderc
 * @description Index router.
 */

const express = require("express");

const authRoutes = require("./auth");
const userRoutes = require("./user");

const app = express();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

module.exports = app;
