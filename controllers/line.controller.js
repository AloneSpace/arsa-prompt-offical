const axios = require("axios");
const { provinces } = require("../config/thailand");

let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_TOKEN}`,
};

const { covidStats } = require("../controllers/stats.controller");
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
                text: "🔍 กรุณาพิมพ์จังหวัด",
            };
            break;
        case "สมัครอาสา":
            let uri_encoded = JSON.stringify(
                {
                    userId: userId,
                    replyToken: replyToken,
                });
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
                                height: "sm",
                                action: {
                                    type: "uri",
                                    label: "🙌 กดปุ่มเพื่อสมัครอาสา",
                                    uri: `https://lovely-moth-18.loca.lt/v1/pages/register?id=${encodeURI(
                                        //TODO: มาแก้ URL ตอน Production
                                        uri_encoded
                                    )}`,
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
                body.messages[0] = {
                    type: "text",
                    text: `คุณอยู่จังหวัด ${province[0]}`,
                };
            }
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
