const db = require('../utils/firebase');
const volunteersRef = db.collection('volunteers');

exports.getAllVolunteers = async function (req, res) {
    const docs = await volunteersRef.get();
    if(docs.empty) return res.status(404).json("No Data Found");
    let tempData = [];
    docs.forEach(doc => {
        tempData.push(doc.data());
    })
    return res.status(200).json(tempData);
};

exports.createVolunteers = async function (req, res) {
    let reqData = req.body;
    if (!reqData.userId||!reqData.address || !reqData.name || !reqData.otherContact || !reqData.phone || !reqData.province) return res.status(400).json("Fill Form")
    let data = {
        "userId" : req.body.userId,
        "address": req.body.address,
        "created_at": + new Date(),
        "name": req.body.name,
        "otherContact": req.body.otherContact,
        "phone": req.body.phone,
        "province": req.body.province
    }
    try {
        await volunteersRef.add(data);
        return res.status(201).json({
            "status" : "success"
        })
    } catch (err) {
        console.log(err);
    }
}
