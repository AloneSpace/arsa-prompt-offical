const axios = require("axios");
const { provinces } = require("../config/thailand");
let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_TOKEN}`,
};

const { covidStats } = require("../controllers/stats.controller");
const {
    fetchVolunteersByProvince,
    fetchVolunteersByUserId,
} = require("../controllers/volunteer.controller");
const { thousand_separator } = require("../utils/convert");

exports.line_controller = async function (req, res) {
    try {
        let replyToken = req.body.events[0].replyToken;
        await reply(
            replyToken,
            req.body.events[0].message.text,
            req.body.events[0].source.userId
        );
        res.sendStatus(200);
    } catch (e) {
        console.log(e);
    }
};

async function reply(replyToken, text, userId) {
    let body = { replyToken: replyToken, messages: [{}] };
    switch (text) {
        case "สถานการณ์โควิดวันนี้":
            let data = await covidStats();
            body.messages[0] = {
                type: "text",
                text: `⌚️ ข้อมูลเมื่อ ${data.UpdateDate
                    }\n\n==========================\n\n➕ ผู้ติดเชื้อสะสม ${thousand_separator(
                        data.cases
                    )} คน\n\n💊 รักษาหายสะสม ${thousand_separator(
                        data.recovered
                    )} คน\n\n🏥 กำลังรักษา ${thousand_separator(
                        data.active
                    )} คน\n\n🪦 ผู้เสียชีวิตทั้งหมด ${thousand_separator(
                        data.deaths
                    )} คน\n\n🦠 ผู้ติดเชื้อวันนี้ ${thousand_separator(
                        data.todayCases
                    )} คน\n\n😀 รักษาหายวันนี้ ${thousand_separator(
                        data.todayRecovered
                    )} คน\n\n🤢 อาการรุนแรง ${thousand_separator(
                        data.critical
                    )} คน\n\n💀 ผู้เสียชีวิตวันนี้ ${thousand_separator(
                        data.todayDeaths
                    )} คน`,
            };
            break;
        case "ขอความช่วยเหลือ":
            body.messages[0] = {
                type: "text",
                text: "🔍 กรุณาพิมพ์ชื่อจังหวัด",
            };
            break;
        case "สมัครอาสา":
            let uri_encoded = Buffer.from(
                JSON.stringify({
                    userId: userId,
                })
            ).toString("hex");
            let users = await fetchVolunteersByUserId(userId);
            let uri = `https://arsa-prompt.alonecoding.com/v1/pages/register/${encodeURI(uri_encoded)}`;
            if (users.length) {
                let secretid = users[0].secret;
                uri = `https://arsa-prompt.alonecoding.com/v1/pages/editprofile/${secretid}`
            }
            body.messages[0] = {
                type: "flex",
                altText: "สมัครอาสาสมัคร",
                contents: {
                    type: "bubble",
                    body: {
                        type: "box",
                        layout: "vertical",
                        contents: [
                            {
                                type: "button",
                                style: "primary",
                                color: users.length ? "#FFBD33" : null,
                                height: "sm",
                                action: {
                                    type: "uri",
                                    label: users.length
                                        ? "🙌 กดปุ่มเพื่อแก้ไขข้อมูลอาสาสมัคร"
                                        : "🙌 กดปุ่มเพื่อสมัครอาสา",
                                    uri: uri,
                                },
                            },
                        ],
                    },
                },
            };
            break;
        default:
            let province = provinces.filter((prov) => prov.includes(text));
            if (province.length) {
                let volunteers = await fetchVolunteersByProvince(province[0]);
                body.messages[0] = {
                    type: "text",
                    text: `📌 จังหวัดที่คุณเลือก ${province[0]} (${volunteers.length} คน)`,
                };
                body.messages[1] = {
                    type: "text",
                    text: "",
                };
                if (!volunteers.length)
                    body.messages[1].text = `❌❌ ไม่พบอาสาสมัคร 😢😢`;
                for (let [index, volunteer] of volunteers.entries()) {
                    body.messages[1].text += `• ${volunteer.name}\n📞 ${volunteer.phone}\n🏠 ${volunteer.address}\n🌐 ช่องทารการติดต่ออื่นๆ \n${volunteer.otherContact}`;
                    if (index !== volunteers.length - 1)
                        body.messages[1].text += "\n\n";
                }
            } else
                body.messages[0] = {
                    type: "text",
                    text: `🧐 เราไม่พบจังหวัดนี้ในประเทศไทย`,
                };
            break;
    }
    await axios({
        method: "post",
        url: "https://api.line.me/v2/bot/message/reply",
        headers: headers,
        data: JSON.stringify(body),
    });
}

const getUserLINEInfo = function (userId) {
    return new Promise((resolve, reject) => {
        request.get(
            {
                url: `https://api.line.me/v2/bot/profile/${userId}`,
                headers: headers,
            },
            (err, response, body) => {
                if (err) return reject(err);
                resolve(body);
            }
        );
    });
};
