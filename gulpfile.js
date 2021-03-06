var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var reactify = require('reactify');
var watchify = require('watchify');
var notify = require("gulp-notify");
var dirToJson = require('dir-to-json');
var jf = require('jsonfile');


var scriptsDir = './js';
var buildDir = './build';


// Based on: http://blog.avisi.nl/2014/04/25/how-to-keep-a-fast-build-with-browserify-and-reactjs/
function buildScript(file, watch) {
  var props = watchify.args;
  props.entries = [scriptsDir + '/' + file];
  props.debug = true;

  var bundler = watch ? watchify(browserify(props)) : browserify(props);

  bundler.transform(reactify);

  function rebundle() {
    var stream = bundler.bundle();
    return stream.on('error', notify.onError({
        title: "Compile Error",
        message: "<%= error.message %>"
      }))
      .pipe(source(file))
      .pipe(gulp.dest(buildDir + '/'));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}

function buildDataPaths(rootDir, file) {
  dirToJson(rootDir)
    .then(function(dirTree) {
      console.log(dirTree);
      jf.writeFileSync(file, dirTree);
    })
    .catch(function(err) {
      throw err;
    });
}


gulp.task('build', function() {
  return buildScript('app.js', false);
});

gulp.task('buildDataPaths', function() {
  return buildDataPaths('./data', 'dataPaths.json');
});

gulp.task('default', ['build'], function() {
  return buildScript('app.js', true);
});
