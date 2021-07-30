function randid(length) {
    let result           = '';
    let char       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let len = char.length;
    for ( var i = 0; i < length; i++ ) {
      result += char.charAt(Math.floor(Math.random() * 
      len));
   }
   return result;
}

module.exports = { randid };