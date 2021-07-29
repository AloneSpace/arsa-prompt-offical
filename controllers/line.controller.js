const axios = require("axios");

let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.LINE_TOKEN}`,
};

const { covidStats } = require("../controllers/stats.controller");
const convert;

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
                text: `⌚️ ข้อมูลเมื่อ ${data.UpdateDate}\n\n🦠 ผู้ติดเชื้อสะสม ${data.cases} คน`,
            };
            break;
        default:
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
