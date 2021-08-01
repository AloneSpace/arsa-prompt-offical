const db = require("../utils/firebase");
const axios = require("axios");
const volunteersRef = db.collection("volunteers");
const { randid } = require("../utils/randomId");

const getAllVolunteers = async function (req, res) {
    const volunteers = await fetchVolunteers();
    if (!volunteers.length)
        return res.status(404).json({
            status: "error",
            message: "No Data founded",
        });
    return res.status(200).json(volunteers);
};

const findVolunteersByProvince = async function (req, res) {
    const volunteers = await fetchVolunteersByProvince(req.params.province);
    if (!volunteers.length)
        return res.status(404).json({
            status: "error",
            message: "No Data founded",
        });
    return res.status(200).json(volunteers);
};

const findVolunteersByUserId = async function (req, res) {
    const volunteers = await await fetchVolunteersByUserId(req.body.userId);
    if (!volunteers.length)
        return res.status(404).json({
            status: "error",
            message: "No Data founded",
        });
    return res.status(200).json(volunteers);
};

const findVolunteersBySecretId = async function (req, res) {
    const volunteers = await fetchVolunteersBySecretId(req.params.secretId);
    if (!volunteers.length)
        return res.status(404).json({
            status: "error",
            message: "No Data founded",
        });
    return res.status(200).json(volunteers);
};

const createVolunteers = async function (req, res) {
    let reqData = req.body;
    let uri = reqData.uri;
    try {
        let uri_decoded = JSON.parse(
            Buffer.from(decodeURI(uri), "hex").toString()
        );
        if (
            !reqData.address ||
            !reqData.name ||
            !reqData.note ||
            !reqData.phone ||
            !reqData.province ||
            !uri_decoded.userId
        )
            return res.status(200).json({
                status: "error",
                message: "Fill the form",
            });
        if ((await fetchVolunteersByUserId(uri_decoded.userId)).length)
            return res.status(400).json({
                status: "error",
                message: "You're already volunteers",
            });
        let randId = randid(16);
        let data = {
            userId: uri_decoded.userId,
            address: reqData.address,
            created_at: +new Date(),
            name: reqData.name,
            note: reqData.note,
            phone: reqData.phone,
            province: reqData.province,
            secretId: randId,
        };
        try {
            await volunteersRef.add(data);
            await axios({
                method: "post",
                url: "https://api.line.me/v2/bot/message/push",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.LINE_TOKEN}`,
                },
                data: JSON.stringify({
                    to: uri_decoded.userId,
                    messages: [
                        {
                            type: "text",
                            text:
                                "🙏 ทางเราขอขอบคุณ ท่านที่สละเวลาอันมีค่าเพื่อช่วยเหลือคนอื่น\nหากต้องการแก้ไขข้อมูล กรุณากดปุ่มด้านล่าง 👇👇👇",
                        },
                        {
                            type: "flex",
                            altText: "แก้ไขข้อมูลอาสาสมัคร",
                            contents: {
                                type: "bubble",
                                body: {
                                    type: "box",
                                    layout: "vertical",
                                    contents: [
                                        {
                                            type: "button",
                                            style: "primary",
                                            color: "#FFBD33",
                                            height: "sm",
                                            action: {
                                                type: "uri",
                                                label: "🙌 กดปุ่มเพื่อแก้ไขข้อมูลอาสาสมัคร",
                                                uri: `https://arsa-prompt.alonecoding.com/v1/pages/editprofile/${randId}`,
                                            },
                                        },
                                    ],
                                },
                            }
                        }
                    ],
                }),
            });
            // console.log(data);
            return res.status(201).json({
                status: "success",
                message: "Create Success",
            });
        } catch (err) {
            // console.log(err);
            return res.status(400).json({
                status: "error",
                message: "Something wrong ",
            });
        }
    } catch (err) {
        // console.log(err);
        return res.status(400).json({
            status: "error",
            message: "URI wrong",
        });
    }
};

const updateVolunteers = async function (req, res) {
    let reqData = req.body;
    let paramsData = req.params;
    let userdata = await fetchVolunteersBySecretId(paramsData.secret);
    if (!userdata.length)
        return res.status(404).json({
            status: "error",
            message: "No Data founded",
        });
    if (
        !reqData.address ||
        !reqData.name ||
        !reqData.note ||
        !reqData.phone ||
        !reqData.province
    )
        return res.status(200).json({
            status: "error",
            message: "Fill the form",
        });
    let data = {
        address: reqData.address,
        name: reqData.name,
        note: reqData.note,
        phone: reqData.phone,
        province: reqData.province,
    };
    try {
        const response = await volunteersRef
            .doc(userdata[0].id)
            .set(data, { merge: true });
        res.status(201).json({
            status: "success",
            message: "Updated Data",
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

const fetchVolunteersByUserId = async function (userId) {
    const docs = await volunteersRef.where("userId", "==", userId).get();
    if (docs.empty) return [];
    let tempData = [];
    docs.forEach((doc) => {
        tempData.push(doc.data());
    });
    return tempData;
};
const fetchVolunteersBySecretId = async function (secretId) {
    const docs = await volunteersRef.where("secretId", "==", secretId).get();
    if (docs.empty) return [];
    let tempData = [];
    docs.forEach((doc) => {
        tempData.push({ id: doc.id, data: doc.data() });
    });
    return tempData;
};

module.exports = {
    createVolunteers,
    updateVolunteers,
    getAllVolunteers,
    fetchVolunteers,
    fetchVolunteersByProvince,
    findVolunteersByProvince,
    fetchVolunteersBySecretId,
    findVolunteersBySecretId,
    fetchVolunteersByUserId,
};
