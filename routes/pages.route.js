const controller = require("../controllers/pages.controller");

module.exports = (express) => {
    const route = express.Router();

    route.get("/", controller.index);
    route.get("/register", controller.register);
    return route;
};
