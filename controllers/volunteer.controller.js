const db = require("../utils/firebase");
const volunteersRef = db.collection("volunteers");

const getAllVolunteers = async function (req, res) {
    const volunteers = await fetchVolunteers();
    if (!volunteers.length) return res.status(404).json("No Data Found");
    return res.status(200).json(volunteers);
};

const findVolunteersByProvince = async function (req, res) {
    const volunteers = await fetchVolunteersByProvince(req.params.province);
    if (!volunteers.length) return res.status(404).json("No Data Found");
    return res.status(200).json(volunteers);
};

const createVolunteers = async function (req, res) {
    let reqData = req.body;
    if (
        !reqData.userId ||
        !reqData.address ||
        !reqData.name ||
        !reqData.otherContact ||
        !reqData.phone ||
        !reqData.province
    )
        return res.status(400).json("Fill Form");
    let data = {
        userId: req.body.userId,
        address: req.body.address,
        created_at: +new Date(),
        name: req.body.name,
        otherContact: req.body.otherContact,
        phone: req.body.phone,
        province: req.body.province,
    };
    try {
        await volunteersRef.add(data);
        return res.status(201).json({
            status: "success",
        });
    } catch (err) {
        console.log(err);
    }
};

const fetchVolunteers = async function () {
    const docs = await volunteersRef.get();
    if (docs.empty) return [];
    let tempData = [];
    docs.forEach((doc) => {
        tempData.push(doc.data());
    });
    return tempData;
};

const fetchVolunteersByProvince = async function (province) {
    const docs = await volunteersRef.where("province", "==", province).get();
    if (docs.empty) return [];
    let tempData = [];
    docs.forEach((doc) => {
        tempData.push(doc.data());
    });
    return tempData;
};

module.exports = {
    createVolunteers,
    getAllVolunteers,
    fetchVolunteers,
    fetchVolunteersByProvince,
    findVolunteersByProvince,
};
