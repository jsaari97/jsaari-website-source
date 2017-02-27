var gulp        = require('gulp')
var browserify  = require('browserify')
var babelify    = require('babelify')
var source      = require('vinyl-source-stream')
var buffer      = require('vinyl-buffer')
var uglify      = require('gulp-uglify')
var sourcemaps  = require('gulp-sourcemaps')
var browserSync = require('browser-sync').create()
var reload      = browserSync.reload
var pug         = require('gulp-pug')
var sass        = require('gulp-sass')
var fs          = require('fs')
var svgSprite   = require('gulp-svg-sprite')
var postcss     = require('gulp-postcss')
var autoprefixer = require('autoprefixer')
var bourbon     = require("bourbon").includePaths
var sassGlob    = require('gulp-sass-glob')
var responsive  = require('gulp-responsive')
var sitemap     = require('gulp-sitemap')

function swallowError (error) {
  console.log(error.toString())
  this.emit('end')
}

gulp.task('images', function () {
  return gulp.src('src/images/*.{jpg,png}')
    .pipe(responsive({
      '*': [{
        width: 480,
        quality: 95,
        rename: {
          suffix: '-small',
          extname: '.jpg',
        },
      }, {
        width: 768,
        quality: 95,
        rename: {
          suffix: '-medium',
          extname: '.jpg',
        },
      }, {
        width: 1280,
        quality: 95,
        rename: {
          suffix: '-large',
          extname: '.jpg',
        },
      },
      {
        width: 1920,
        quality: 95,
        rename: {
          suffix: '-xlarge',
          extname: '.jpg',
        },
      }],
    }))
    .pipe(gulp.dest('dist/images'))
})

gulp.task('pug', function() {
  return gulp.src('src/*.pug')
    .pipe(pug({
      data: JSON.parse(fs.readFileSync('./src/data.json'))
    }))
    .on('error', swallowError)
    .pipe(gulp.dest('./dist'))
})

gulp.task('pug-watch', ['pug'], function(done) {
  reload()
  done()
})
 
gulp.task('js', function () {
    return browserify({entries: './src/js/main.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .on('error', swallowError)
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'))
        .pipe(browserSync.stream())
})

gulp.task('sass', function() {
    return gulp.src("src/scss/main.scss")
        .pipe(sassGlob())
        .pipe(sass({
          includePaths: bourbon
        }))
        .on('error', swallowError)
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest("dist/css"))
        .pipe(browserSync.stream())
})

gulp.task('svg', function() {
  return gulp.src('src/svg/**/*.svg')
        .pipe(svgSprite({
              mode: {
                  symbol: {
                      render: {
                          css: false,
                          scss: false
                      },
                      dest: '',
                      sprite: 'sprite.svg',
                  }
              }
          }))
        .on('error', swallowError)
        .pipe(gulp.dest('dist/svg/'))
})

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './dist'
    },
    open: false
  })

  gulp.watch("src/scss/**/*.scss", ['sass'])
  gulp.watch("src/svg/**/*.svg", ['svg'])
  gulp.watch("src/js/**/*.js", ['js'])
  gulp.watch('src/**/*.pug', ['pug-watch'])
  gulp.watch('src/data.json', ['pug-watch'])
  gulp.watch('src/images/**/*.{jpg,jpeg,png}', ['images'])
});

gulp.task('default', ['pug', 'js', 'sass', 'svg', 'images', 'serve'])

//Production
gulp.task('production', ['sitemap', 'js-production', 'sass-production', 'svg', 'images'])

gulp.task('js-production', function () {
    return browserify({entries: './src/js/main.js', debug: true})
        .transform("babelify", { presets: ["es2015"] })
        .bundle()
        .pipe(source('main.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(gulp.dest('./dist/js'))
})

gulp.task('sass-production', function() {
    return gulp.src("src/scss/main.scss")
        .pipe(sassGlob())
        .pipe(sass({
          includePaths: bourbon,
          outputStyle: 'compressed'
        }))
        .pipe(postcss([ autoprefixer() ]))
        .pipe(gulp.dest("dist/css"))
})

gulp.task('sitemap', ['pug'], function() {
  return gulp.src('dist/**/*.html', {
          read: false
        })
        .pipe(sitemap({
          siteUrl: 'https://jsaari.com'
        }))
        .pipe(gulp.dest('./dist'))
})
