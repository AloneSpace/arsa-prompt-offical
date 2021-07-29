const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'pug')

//* Setup all routes
require("./routes/routes")({ express, app });

app.listen(PORT, () => {
    console.log(`Server listening in ${PORT}`);
});
