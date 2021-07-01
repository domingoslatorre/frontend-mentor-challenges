const { src, dest, watch, series } = require("gulp");
const browserSync = require("browser-sync").create();
const pug = require("gulp-pug");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const babelify = require("babelify");
const browserify = require("browserify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const uglify = require("gulp-uglify");
const sourcemaps = require("gulp-sourcemaps");

function browserSyncServe(cb) {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
  });
  cb();
}

function pagesTask() {
  return src("./src/pages/*.pug")
    .pipe(
      pug({
        pretty: true,
      })
    )
    .pipe(dest("./public"))
    .pipe(browserSync.stream());
}

function stylesTask() {
  const plugins = [
    autoprefixer(), //.browserslistrc file in root
    cssnano(),
  ];

  return src("./src/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(dest("./public/css", { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

function scriptsTask() {
  return browserify({ entries: ["./src/js/script.js"] })
    .transform(
      babelify.configure({
        presets: ["@babel/preset-env"],
      })
    )
    .bundle()
    .pipe(source("script.js"))
    .pipe(buffer())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write("."))
    .pipe(dest("./public/js"))
    .pipe(browserSync.stream());
}

function watchTask() {
  watch(["./src/pages/*.pug"], series(pagesTask));
  watch(["./src/scss/*.scss"], series(stylesTask));
  watch(["./src/js/*.js"], series(scriptsTask));
}

exports.default = series(
  pagesTask,
  stylesTask,
  scriptsTask,
  browserSyncServe,
  watchTask
);
