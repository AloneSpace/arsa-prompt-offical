const { provinces } = require('../config/thailand');
const { fetchVolunteersBySecretId, fetchVolunteersByProvince,fetchVolunteers } = require("../controllers/volunteer.controller");
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
        res.render('volunteers/register', { provinces: provinces, data: { ...uri_decoded }, uri: req.params.data });
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
        res.render('volunteers/editprofile', { provinces: provinces, data: userdata[0].data });
    } catch (err) {
        res.status(404).send("Something Wrong");
    }
}

let search = async (req, res) => {
    res.render("search", { provinces: provinces });
}

let searchVolunteers = async (req, res) => {
    if (!req.body.province) return res.status(400).json({
        "status": "error",
        "message": "Bad Request"
    });

    let province = req.body.province;
    let data = [];
    try {
        data = await fetchVolunteersByProvince(province);
        // console.log(data);
        res.render("result", { datas: data, province });
    } catch (error) {
        console.log(err);
    }
}
let allVolunteers = async (req, res)=>{
    let data = [];
    try {
        data = await fetchVolunteers();
        res.render("result", { datas: data, province : "ทั้งหมด" });
    } catch (error) {
        console.log(err);
    }
}
module.exports = {
    index,
    register,
    editprofile,
    search,
    searchVolunteers,
    allVolunteers
}