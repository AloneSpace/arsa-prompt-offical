const { provinces } = require('../config/thailand');
const { fetchVolunteersBySecretId } = require("../controllers/volunteer.controller");
let index = async (req, res) => {
    res.render('index');
}

let register = async (req, res) => {
    let data = req.params.data;
    try {
        // console.log(data);
        let uri_decoded = JSON.parse(
            Buffer.from(decodeURI(data), "hex").toString()
        );
        // console.log(uri_decoded);
        res.render('register', { provinces: provinces, data: { ...uri_decoded }, uri: req.params.data });
    } catch (err) {
        console.log(err);
        res.status(404).send("Error 404");
    }

}

let editprofile = async (req, res) => {
    let secretId = req.params.secretId;
    if (!secretId) return res.status(400).json({
        "status": "error",
        "message": "Bad request"
    })
    try {
        let userdata = await fetchVolunteersBySecretId(secretId);
        if (!userdata.length) return res.status(400).json({
            "status": "error",
            "message": "User Not Found"
        })
        res.render('editprofile', { provinces: provinces, data: userdata[0].data });
    } catch (err) {
        res.status(404).send("Something Wrong");
    }
}
module.exports = {
    index,
    register,
    editprofile
}