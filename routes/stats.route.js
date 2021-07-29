const controller = require("../controllers/stats.controller");



module.exports = (express) => {
    const route = express.Router();
    
    route.get("/getAll", controller.getAllStats);

    return route;
};
