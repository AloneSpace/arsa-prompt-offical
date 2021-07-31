const express = require("express");
const app = express();
var path = require("path");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//* Setup all routes
require("./routes/routes")({ express, app });

app.listen(PORT, () => {
    console.log(`Server listening in ${PORT}`);
});
