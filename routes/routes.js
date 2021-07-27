module.exports = ({ express, app }) => {
    app.use("/v1/volunteers", require("./volunteer.route")(express));
};
