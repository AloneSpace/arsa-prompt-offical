const controller = require("../controllers/volunteer.controller");

module.exports = (express) => {
    const route = express.Router();

    route.get("/", controller.getAllVolunteers);
    route.get("/other_resources", controller.getAllOtherResources);
    route.get("/:province", controller.findVolunteersByProvince);
    route.post("/create", controller.createVolunteers);
    // route.get("/find/secret/:secretId",controller.findVolunteersBySecretId)
    route.post("/update/:secret", controller.updateVolunteers);
    route.post("/delete/", controller.deleteVolunteers);
    return route;
};
