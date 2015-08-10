var express           = require('express'),
    app               = express(),
    zlib              = require('zlib'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    fs                = require('fs'),
    Grid              = require('gridfs-stream'),
    meetupController  = require('./server/controllers/meetups-controller'),
    fileController    = require('./server/controllers/files-controller');

// connect to server
mongoose.connect('mongodb://localhost:27017/gridfs');
var conn = mongoose.connection;

// to save the data
var buffer = '';

Grid.mongo = mongoose.mongo;
conn.once('open', function() {
  var gfs = Grid(conn.db);

  // to remove a file  
  // gfs.remove({_id: "55c8d8d2bbc3df0c3622ebf1"}, function(err) {
  //   if (err) console.log(err);
  //   else console.log('success');
  // });

  // // writing some files into db
  // var writeStream = gfs.createWriteStream({
  //   filename: '332.pdf'
  // });
  // fs.createReadStream('files/332.pdf').pipe(writeStream);
  // writeStream.on('close', function() {console.log('finished.')})

  // // write content to file system
  var writeStream = fs.createWriteStream('332.pdf');

  // read from mongodb
  var readStream = gfs.createReadStream({filename: '332.pdf'});
  readStream.pipe(writeStream);
  writeStream.on('close', function() {
    console.log('done');
  });

});


// this is where we map the folder for anuglar MVC
app.use(bodyParser());
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
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