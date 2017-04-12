var crypto = require('crypto');

var desParam = {
    alg: 'des-cbc',
    autoPad: true
};

var descrypto = {
    //DES加密
    encryptDES: function encryptDES(plaintext, key) {
        var key = new Buffer(key);
        var iv = new Buffer(key);
        var alg = desParam.alg;
        var autoPad = desParam.autoPad;

        var cipher = crypto.createCipheriv(alg, key, iv);
        cipher.setAutoPadding(autoPad);  //default true  
        var ciph = cipher.update(plaintext, 'utf8', 'hex');
        ciph += cipher.final('hex');
        console.log(alg, ciph);
        return ciph;
    },
    //DES解密
    decryptDES: function decryptDES(ciph, key) {
        var key = new Buffer(key);
        var iv = new Buffer(key);
        var alg = desParam.alg;
        var autoPad = desParam.autoPad;

        var decipher = crypto.createDecipheriv(alg, key, iv);
        decipher.setAutoPadding(autoPad);
        var txt = decipher.update(ciph, 'hex', 'utf8');
        txt += decipher.final('utf8');
        return txt;
    }
};

exports = module.exports = descrypto;