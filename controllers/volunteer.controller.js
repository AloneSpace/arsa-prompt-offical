const db = require("../utils/firebase");
const axios = require("axios");
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

const findVolunteersByUserId = async function (req, res) {
    const volunteers = await await fetchVolunteersByUserId(req.body.userId);
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
        !reqData.province ||
        !reqData.replyToken
    )
        return res.status(200).json({
            status: "error",
            message: "Fill the form",
        });
    if ((await fetchVolunteersByUserId(reqData.userId)).length)
        return res.status(400).json({
            status: "error",
            message: "You're already volunteers",
        });
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
        await axios({
            method: "post",
            url: "https://api.line.me/v2/bot/message/reply",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.LINE_TOKEN}`,
            },
            data: JSON.stringify({
                replyToken: reqData.replyToken,
                messages: [
                    {
                        type: "text",
                        text:
                            "🙏 ทางเราขอขอบคุณ ท่านที่สละเวลาอันมีค่าเพื่อช่วยเหลือคนอื่น",
                    },
                ],
            }),
        });
        return res.status(201).json({
            status: "success",
            message: "Create Success",
        });
    } catch (err) {
        console.log(err);
        return res.status(400).json({
            status: "error",
            message: "Something wrong",
        });
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

const fetchVolunteersByUserId = async function (userId) {
    const docs = await volunteersRef.where("userId", "==", userId).get();
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
