const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//* Setup all routes
require("./routes/routes")({ express, app });

app.listen(PORT, () => {
    console.log(`Server listening in ${PORT}`);
});
