var express           = require('express'),
    app               = express(),
    zlib              = require('zlib'),
    bodyParser        = require('body-parser'),
    mongoose          = require('mongoose'),
    fs                = require('fs'),
    Grid              = require('gridfs-stream'),
    zlib              = require('zlib'),
    gzip              = zlib.createGzip(),
    gunzip            = zlib.createGunzip();


// connect to server
mongoose.connect('mongodb://localhost:27017/gridfs');
var conn = mongoose.connection;

Grid.mongo = mongoose.mongo;
conn.once('open', function() {
  var gfs = Grid(conn.db);

  //write(gfs, 'files/', 'oversize.pdf');
  //read(gfs, 'oversize.pdf')
  //remove(gfs, 'oversize.pdf')
  //zip('files/', 'oversize.pdf');
  //unzip('java.pdf');
});

// writing files onto mongodb
function write(gfs, path, filename, start) {
  // var filename = $('#filename').val().replace('C:\\fakepath\\', '');
  var writeStream = gfs.createWriteStream({filename: filename});
  fs.createReadStream(path + filename).pipe(writeStream);
  writeStream.on('close', function() {
    var end = new Date().getTime();
    console.log(end - start);
  });
}

// reading files onto mongodb
function read(gfs, filename) {
  var writeStream = fs.createWriteStream(filename);
  var readStream  = gfs.createReadStream({filename: filename});
  readStream.pipe(writeStream);
  writeStream.on('close', function() {
    console.log('finished reading ' + filename);
  });
}

// removing files onto mongodb
function remove(gfs, filename) {
  gfs.remove({filename: filename}, function(err) {
    if (err) console.log(err);
    else console.log('finished deleting ' + filename);
  });
}

function zip(path, filename) {
  var start = new Date().getTime();
  var readStream = fs.createReadStream(path + filename);
  var writeStream = fs.createWriteStream(filename + '.gz');
  readStream.pipe(gzip).pipe(writeStream);
  writeStream.on('finish', function() {
    console.log('finished compressing');
    write(gfs, '', 'oversize.pdf.gz', start)
  });
}

function unzip(filename) {
  var readStream = fs.createReadStream(filename + '.gz');
  var writeStream = fs.createWriteStream(filename);
  readStream.pipe(gunzip).pipe(writeStream);
  writeStream.on('finish', function() {
    console.log('finished decompressing');
  });
}

// this is where we map the folder for anuglar MVC
app.use(bodyParser());
app.use('/js', express.static(__dirname + '/client/js'));
app.use('/css', express.static(__dirname + '/client/css'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

// mapping get, post...etc
app.get('/', function(req, res) {
  res.sendfile(__dirname + '/client/views/index.html');
});

app.listen(3000, function() {
  console.log('Listening on port 3000...');
})