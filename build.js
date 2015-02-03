var uglify = require('uglify-js');
var browserify = require('browserify');
var watchify = require('watchify');
var fs = require('fs');

var filename = 'noteFactory';

var dest = './dist/'+filename+'.js';
var destmin = './dist/'+filename+'.min.js';

var b = browserify();
b.add('./index.js');
b.bundle()
    .pipe(fs.createWriteStream(dest))
    .on('finish', function(){
        var content = uglify.minify(dest).code;
        fs.writeFile(destmin, content);
    });