var uglify = require('uglify-js');
var browserify = require('browserify');
var watchify = require('watchify');
var fs = require('fs');

var dest = './dist/noteFactory.js';
var destmin = './dist/noteFactory.min.js';

var b = browserify();
b.add('./index.js');
b.bundle()
    .pipe(fs.createWriteStream(dest))
    .on('finish', function(){
        var content = uglify.minify(dest).code;
        fs.writeFile(destmin, content);
    });