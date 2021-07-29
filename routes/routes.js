module.exports = ({ express, app }) => {
    app.use("/v1/volunteers", require("./volunteer.route")(express));
    app.use("/v1/stats",require("./stats.route")(express))
};
