require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// routes
const userRoutes = require("./routes/userRoutes.js");

const app = express();

// middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", userRoutes);

app.use("/", (req, res) => {
    console.log("Welcome to our server.");
    res.json({ message: "Hello World!" })
})

const PORT  = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
