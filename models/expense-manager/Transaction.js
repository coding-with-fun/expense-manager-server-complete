/**
 * @author Coderc
 * @description Transaction Model.
 */

const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: Number,
            required: true,
            trim: true,
        },

        amount: {
            type: Number,
            required: true,
            trim: true,
        },

        date: {
            type: Number,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = Transaction = mongoose.model("Transaction", TransactionSchema);
