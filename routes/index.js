/**
 * @author Coderc
 * @description Index router.
 */

const express = require("express");

const expressManagerRoutes = require("./expense-manager");

const app = express();

app.use("/expense-manager", expressManagerRoutes);

module.exports = app;
