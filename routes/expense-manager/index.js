/**
 * @author @harsh-coderc
 * @description Index router for Expense Manager.
 */

/**
 * @description Importing package dependencies.
 */
const express = require("express");

/**
 *  @description Importing internal dependencies.
 */
const authRoutes = require("./auth.route");
const userRoutes = require("./user.route");

/**
 *  @description Defining variables.
 */
const app = express();

/**
 *  @description Defining routes for authentication.
 * @example /expense-manager/auth/*
 */
app.use("/auth", authRoutes);

/**
 *  @description Defining routes for user.
 * @example /expense-manager/user/*
 */
app.use("/user", userRoutes);

module.exports = app;
