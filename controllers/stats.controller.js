const axios = require("axios");

async function getAllStats(req, res) {
    try {
        let stats = await covidStats();
        return res.status(200).json(stats);
    } catch (e) {
        console.log(e);
    }
}

async function covidStats() {
    return new Promise((resolve, reject) => {
        axios
            .get("https://static.easysunday.com/covid-19/getTodayCases.json")
            .then((result) => {
                result = result.data;
                let data = {
                    UpdateDate: result.UpdateDate,
                    updated: result.updated,
                    cases: result.cases,
                    todayCases: result.todayCases,
                    deaths: result.deaths,
                    todayDeaths: result.todayDeaths,
                    recovered: result.recovered,
                    todayRecovered: result.todayRecovered,
                    active: result.active,
                    critical: result.critical,
                    credit: result.DevBy,
                };
                resolve(data);
            })
            .catch((err) => {
                reject(err);
            });
    });
}

module.exports = {
    covidStats,
    getAllStats,
};
