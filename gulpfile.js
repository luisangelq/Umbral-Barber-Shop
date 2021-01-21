const { series, src, dest, watch } = require("gulp");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const notify = require("gulp-notify");
const webp = require("gulp-webp");
const concat = require("gulp-concat");

//CSS Utilities
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const sourcemaps = require("gulp-sourcemaps");

//JS Utilities
const terser = require("gulp-terser-js");

function css() {
  return src("src/scss/app.scss")
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe( sourcemaps.write("."))
    .pipe(dest("./build/css"));
}

function minif() {
  return src("src/scss/app.scss")
    .pipe(
      sass({
        outputStyle: "compressed",
      })
    )
    .pipe(dest("./build/css"));
}

function javascript() {
  return src("src/js/**/*.js")
    .pipe(sourcemaps.init())
    .pipe(concat("bundle.js"))
    .pipe( terser())
    .pipe(sourcemaps.write("."))
    .pipe(dest("./build/js"));
}

function images() {
  return src("src/img/**/*")
    .pipe(imagemin())
    .pipe(dest("./build/img"))
    .pipe(notify({ message: "Minificaded Image" }));
}

function verWebp() {
  return src("src/img/**/*").pipe(webp()).pipe(dest("./build/img"));
}

function run() {
  watch("src/scss/**/*.scss", css);
  watch("src/js/**/*.js", javascript);
}

exports.css = css;
exports.minif = minif;
exports.images = images;
exports.run = run;
exports.default = series(css, javascript, images, verWebp, run);
