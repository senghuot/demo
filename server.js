var express           = require('express'),
    app               = express(),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    meetupController  = require('./server/controllers/meetups-controller');

mongoose.connect('mongodb://localhost:27017/demo');

// this is where we map the folder for anuglar MVC
app.use(bodyParser());
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// mapping get, post...etc
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/client/views/index.html');
});

app.post('/api/meetups', meetupController.create);
app.get('/api/meetups', meetupController.get);

app.listen(3000, function() {
  console.log('Listening on port 3000...');
})