var Pool = require('pg').Pool;
var config = require('../config.js');

process.on('unhandledRejection', function(e) {
    console.log(e.message, e.stack)
})

module.exports = new Pool(config.pg_dev);
