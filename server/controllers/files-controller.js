var File = require('../models/file.js');

module.exports.get = function() {
  File.find({}, function(err, results) {
    console.log(results);
  })
}