const controller = require("../controllers/stats.controller");

module.exports = (express) => {
    const route = express.Router();

    route.get("/", controller.getAllStats);

    return route;
};
