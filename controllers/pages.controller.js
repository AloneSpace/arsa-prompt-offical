const { provinces } = require('../config/thailand');
let index = async (req, res) => {
    res.render('index');
}

let register = async (req, res) => {
    let data = req.params.data;
    try {
        // console.log(data);
        let uri_decoded = JSON.parse(
            Buffer.from(decodeURI(data), "hex").toString()
        );
        // console.log(uri_decoded);
        res.render('register', { provinces: provinces, data: { ...uri_decoded }, uri : req.params.data });
    } catch (err) {
        console.log(err);
        res.status(404).send("Error 404");
    }

}

module.exports = {
    index,
    register
}