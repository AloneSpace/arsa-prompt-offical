const controller = require("../controllers/line.controller");

module.exports = (express) => {
    const route = express.Router();

    route.get("/", controller.getAllVolunteers);

    return route;
};
