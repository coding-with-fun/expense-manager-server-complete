/**
 * @author @harsh-coderc
 * @description Index router.
 */

/**
 * @description Importing package dependencies.
 */
const express = require("express");

/**
 *  @description Importing internal dependencies.
 */
const expressManagerRoutes = require("./expense-manager");

/**
 *  @description Defining variables.
 */
const app = express();

/**
 *  @description Defining routes for Expense Manager.
 * @example /expense-manager/*
 */
app.use("/expense-manager", expressManagerRoutes);

module.exports = app;
