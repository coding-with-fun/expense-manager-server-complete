const express = require("express");
require("colors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`.red);
});

app.use("/", (req, res) => {
    res.json({
        message: "Hello Sir...",
    });
});
