let index = async (req, res) => {
    res.render('index');
}

let register = async (req, res)=>{
    let data = req.body;
    res.render('register');
}

module.exports ={
    index,
    register
}