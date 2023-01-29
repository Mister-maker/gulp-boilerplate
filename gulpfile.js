const gulp = require('gulp'); // Gulp of-course 
var sass = require('gulp-sass')(require('sass')); // Gulp plugin for Sass compilation
const concat = require('gulp-concat');  // Concatenates files
const uglify = require('gulp-uglify'); // Minifies JS files
const rename = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
const postcss = require('gulp-postcss'); // Gulp plugin to pipe CSS through several plugins, but parse CSS only once.
const autoprefixer = require('autoprefixer'); // Parse CSS and add vendor prefixes to CSS rules using values from Can I Use
const cssnano = require('cssnano'); // Minify CSS with cssnano.
const browsersync = require('browser-sync').create(); // Reloads browser and injects CSS. Time-saving synchronised browser testing.

const options = {
  columns: 12, // the number of columns in the grid
  maxWidth: 960, // the maximum width of the grid (in px)
  gutter: 20, // the width of the gutter (in px)
  legacy: false, // fixes the double-margin bug in older browsers. Defaults to false
};

function css() {
  const processors = [autoprefixer, cssnano];

  return gulp
    .src('src/css/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass()) // Converts Sass to CSS with gulp-sass
    .pipe(postcss(processors)) // PostCSS plugins
    .pipe(rename({ suffix: '.min' })) // Renames output file
    .pipe(gulp.dest('dist/assets/css')) // Outputs CSS file in dist folder
    .pipe(browsersync.stream()); // Reloads page via browsersync
}

function js() {
  return gulp
    .src('src/js/*.js') // Gets all files ending with .js in app/js
    .pipe(concat('main.js')) // Concatenates all files into one main.js
    .pipe(gulp.dest('dist/assets/js')) // Outputs main.js in dist folder
    .pipe(rename('main.min.js')) // Renames main.js to main.min.js
    .pipe(uglify()) // Minifies JS
    .pipe(gulp.dest('dist/assets/js')) // Outputs main.min.js in dist folder
    .pipe(browsersync.stream()); // Reloads page via browsersync
}

function images() {
  return gulp.src('src/images/**/*') // Gets all files ending with .jpg, .jpeg, .png, .svg, .gif in app/images
    .pipe(gulp.dest('dist/assets/images')) // Outputs the file in the destination folder
    .pipe(browsersync.stream()); // Reloads page via browsersync
}

function html(){
  return gulp.src('src/*.html') // Gets all files ending with .html in app/
    .pipe(gulp.dest('dist')) // Outputs the file in the destination folder
    .pipe(browsersync.stream()); // Reloads page via browsersync
}

function browserSync(done) {
  browsersync.init({ // Initialize Browsersync
    server: { // Set server
      baseDir: "./dist"
    },
    notify: false, // Disable notifications
    injectChanges: true,
    port: 3000 // Change port number if needed
  });
  done();
}

function browserSyncReload(done) { // Reloads the browser with Browsersync
  browsersync.reload();
  done();
}

function browserSyncWatch() { // Watch files and run browserSyncReload after changes
  gulp.watch('src/css/*.scss', css, browserSyncReload);
  gulp.watch('src/js/*.js', js, browserSyncReload);
  gulp.watch('src/images/**/*', images, browserSyncReload);
  gulp.watch('src/*.html', html, browserSyncReload);
}

function watch() { // Watch files and run tasks after changes
  gulp.watch('src/css/*.scss', css);
  gulp.watch('src/js/*.js', js);
  gulp.watch('src/images/**/*', images);
}

exports.default = gulp.series(css, js, images, html, watch); // Default task
exports.bs = gulp.series(css, js, images, html, browserSync, browserSyncWatch); // BrowserSync task

