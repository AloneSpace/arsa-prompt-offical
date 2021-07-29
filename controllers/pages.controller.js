const { provinces } = require('../config/thailand');
let index = async (req, res) => {
    res.render('index');
}

let register = async (req, res) => {
    let data = req.body;
    res.render('register', { provinces: provinces });
}

module.exports = {
    index,
    register
}