'use strict';

const gulp     = require('gulp');
const options  = require('./tasks/options');
const browser  = require('browser-sync').create();
const del      = require('del');

gulp.task('compile', require('./tasks/compile'));

/**
 * @section Docs
 */
function clean() {
    return del(options.paths.docs + '/*');
}

exports.clean = clean;
gulp.task('doc',  require('./tasks/docs'));
gulp.task('docs', gulp.series( clean, gulp.parallel( 'doc' ) ) );


/**
 * @section Sync
 */
function reload(done) {
    browser.reload();
    done();
}

function sync(done) {
    browser.init({
      server: {
         baseDir: options.paths.docs
      }
    });
    done();
}


/**
 * @section Watch
 */
function watch() {
  gulp.watch( options.paths.root + 'sass/**/*.scss',   gulp.series( 'compile', 'doc', reload ) );
  gulp.watch( options.paths.root + '*.js',             gulp.series( 'compile', 'doc', reload ) );
  gulp.watch( options.paths.src  + 'img/**/*.*',       gulp.series( 'doc', reload ) );
  gulp.watch( options.paths.src  + 'templates/*.html', gulp.series( 'doc', reload ) );
  gulp.watch( options.paths.src  + 'datas/**/*.json',  gulp.series( 'doc', reload ) );
}
exports.watch   = watch;
exports.default = gulp.series( 'doc', sync, watch );


/**
 * @section Test
 */
gulp.task('test', require('./tasks/tests'));


/**
 * @section Lint
 */
 gulp.task('lint', require('./tasks/lint'));


/**
 * @section Travis
 */
gulp.task('travis', require('./tasks/travis'));
