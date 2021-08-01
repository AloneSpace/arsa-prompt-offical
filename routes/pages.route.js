const controller = require("../controllers/pages.controller");

module.exports = (express) => {
    const route = express.Router();

    route.get("/", controller.index);
    route.get("/register/:data", controller.register);
    route.get("/editprofile/:secretId", controller.editprofile);
    route.get("/search", controller.search);
    route.post("/result", controller.searchVolunteers);
    route.get("/allvolunteers", controller.allVolunteers);

    return route;
};
