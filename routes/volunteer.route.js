const controller = require("../controllers/volunteer.controller");

module.exports = (express) => {
    const route = express.Router();

    route.get("/", controller.getAllVolunteers);
    route.post("/create",controller.createVolunteers);

    return route;   
};
