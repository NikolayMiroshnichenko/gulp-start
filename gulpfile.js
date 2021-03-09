const { src, dest, watch, parallel } = require("gulp");
const scss = require("gulp-sass");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const uglify = require("gulp-uglify-es").default;
const autoprefixer = require("gulp-autoprefixer");
const imagemin = require("gulp-imagemin");

function images() {
  return src("app/img/**/*")
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
        imagemin.svgo({
          plugins: [{ removeViewBox: true }, { cleanupIDs: false }],
        }),
      ])
    )
    .pipe(dest("dist/img"));
}

function scripts() {
  return src(["app/js/**/*.js"])
    // .pipe(concat("main.min.js"))
    // .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function browsersync() {
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function styles() {
  return src("app/scss/style.scss")
    .pipe(
      scss({
        outputStyle: "compressed",
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 10 version"],
        grid: true,
      })
    )
    .pipe(dest("app/css"))
    .pipe(browserSync.stream());
}

function watching() {
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/**/*.js", "!app/js/main.min.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function build() {
  return src(
    [
      "app/js/**/*.js",
      "app/fonts/**/*",
      "app/css/style.min.css",
      "app/*.html",
    ],
    {
      base: "app",
    }
  ).pipe(dest("dist"));
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;
exports.scripts = scripts;
exports.images = images;
exports.build = build;
exports.default = parallel( browsersync, watching);

// scripts,