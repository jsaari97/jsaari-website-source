const gulp = require("gulp");
const $ = require("gulp-load-plugins")();
const browserSync = require("browser-sync").create();
const fs = require("fs");
const bourbon = require("bourbon").includePaths;
const webpack = require("webpack");

const webpackConfig = require("./webpack.config");
const postcssPlugins = [require("autoprefixer")()];

const reload = cb => {
  browserSync.reload();
  cb();
};

const images = () =>
  gulp
    .src("src/images/**/*.{jpg,png}")
    .pipe(
      $.responsive({
        "*": [
          {
            width: 480,
            quality: 95,
            rename: {
              suffix: "-small",
              extname: ".jpg"
            },
            format: "jpg"
          },
          {
            width: 768,
            quality: 95,
            rename: {
              suffix: "-medium",
              extname: ".jpg"
            },
            format: "jpg"
          },
          {
            width: 1280,
            quality: 95,
            rename: {
              suffix: "-large",
              extname: ".jpg"
            },
            format: "jpg"
          },
          {
            width: 1920,
            quality: 95,
            rename: {
              suffix: "-xlarge",
              extname: ".jpg"
            },
            format: "jpg"
          }
        ]
      })
    )
    .pipe(gulp.dest("dist/images"));

const pug = () =>
  gulp
    .src("src/*.pug")
    .pipe(
      $.pug({
        data: JSON.parse(fs.readFileSync("./src/data.json"))
      })
    )
    .pipe(gulp.dest("./dist"));

const js = cb => {
  webpack(webpackConfig, (err, stats) => {
    console.log(
      "[webpack]",
      (err || stats).toString({
        colors: true,
        progress: true
      })
    );

    reload(cb);
  });
};

const sass = () =>
  gulp
    .src("src/scss/main.scss")
    .pipe($.sassGlob())
    .pipe(
      $.sass({
        includePaths: bourbon
      })
    )
    .pipe($.postcss(postcssPlugins))
    .pipe(gulp.dest("dist/css"))
    .pipe(browserSync.stream());

const svg = () =>
  gulp
    .src("src/svg/**/*.svg")
    .pipe(
      $.svgSprite({
        mode: {
          symbol: {
            render: {
              css: false,
              scss: false
            },
            dest: "",
            sprite: "sprite.svg"
          }
        }
      })
    )
    .pipe(gulp.dest("dist/svg"));

const sitemap = () =>
  gulp
    .src("dist/**/*.html", {
      read: false
    })
    .pipe(
      $.sitemap({
        siteUrl: "https://jsaari.com"
      })
    )
    .pipe(gulp.dest("./dist"));

const watch = () => {
  browserSync.init({
    server: {
      baseDir: "dist"
    },
    open: false
  });

  gulp.watch("src/scss/**/*.scss", sass);
  gulp.watch("src/svg/**/*.svg", svg);
  gulp.watch("src/js/**/*.js", js);
  gulp.watch("src/**/*.pug", gulp.series(pug, reload));
  gulp.watch("src/data.json", gulp.series(pug, reload));
  gulp.watch("src/images/**/*.{jpg,jpeg,png}", images);
};

gulp.task("default", gulp.series(pug, js, sass, svg, images, watch));

//Production
gulp.task("production", gulp.series(pug, js, sass, svg, images, sitemap));
