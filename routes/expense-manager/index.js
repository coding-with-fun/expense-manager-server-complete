/**
 * @author Coderc
 * @description Index router.
 */

const express = require("express");

const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

const app = express();

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

module.exports = app;
