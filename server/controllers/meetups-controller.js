var Meetup = require('../models/meetup');

module.exports.create = function(req, res) {
  console.log(req.body);
  var meetup = new Meetup(req.body);
  meetup.save();
}

module.exports.get = function(req, res) {
  Meetup.find({}, function(err, results) {
    res.json(results);
  });
}