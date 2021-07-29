const axios = require('axios');

exports.getAllStats = function (req, res) {
    axios.get("https://static.easysunday.com/covid-19/getTodayCases.json")
        .then(result => {
            result = result.data;
            let data = {
                "UpdateDate": result.UpdateDate,
                "updated": result.updated, 
                "cases": result.cases, 
                "todayCases": result.todayCases,
                "deaths": result.deaths, 
                "todayDeaths": result.todayDeaths, 
                "recovered": result.recovered, 
                "todayRecovered": result.todayRecovered, 
                "active": result.active, 
                "critical": result.critical,
                "credit" : result.DevBy
            }
            res.status(200).json(data);
        })
        .catch(err => {
            console.log(err);
        })
};
