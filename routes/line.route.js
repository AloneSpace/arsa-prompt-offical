const controller = require("../controllers/line.controller");
module.exports = (express) => {
    const route = express.Router();

    route.post("/", controller.line_controller);

    return route;
};
