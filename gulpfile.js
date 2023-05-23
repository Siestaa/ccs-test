const { src, dest } = require('gulp');
const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
const cssbeautify = require('gulp-cssbeautify');
const cssnano = require('gulp-cssnano');
const imagemin = require('gulp-imagemin');
const plumber = require('gulp-plumber');
const removeComments = require('gulp-strip-css-comments');
const rename = require('gulp-rename');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');
const { stream } = require('browser-sync');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');

const srcPath = 'src/';
const distPath = 'build/';

const path = {
  build: {
    html: distPath,
    css: `${distPath}assets/css`,
    js: `${distPath}assets/js`,
    img: `${distPath}assets/img`,
    svg: `${distPath}assets/img`,
    fonts: `${distPath}assets/fonts`,
  },
  src: {
    html: `${srcPath}*.html`,
    css: `${srcPath}assets/scss/styles.scss`,
    js: `${srcPath}assets/js/**/*.js`,
    img: `${srcPath}assets/img/**/*.{jpeg,jpg,png,ico,webp}`,
    svg: `${srcPath}assets/img/sprite/*.svg`,
    fonts: `${srcPath}assets/fonts/**/*.{woff,woff2,eot,ttf}`,
  },
  watch: {
    html: `${srcPath}**/*.html`,
    css: `${srcPath}assets/scss/**/*.scss`,
    js: `${srcPath}assets/js/**/*.js`,
    img: `${srcPath}assets/img/**/*.{jpeg,jpg,png,ico,webp}`,
    svg: `${srcPath}assets/img/sprite/*.svg`,
    fonts: `${srcPath}assets/fonts/**/*.{woff,woff2,eot,ttf}`,
  },
  clean: `./${distPath}`,
};

const serve = () => {
  browserSync.init({
    server: {
      baseDir: distPath,
    },
  });
};

const html = () => {
  return src(path.src.html, { base: srcPath })
    .pipe(plumber())
    .pipe(dest(path.build.html))
    .pipe(browserSync.reload({ stream: true }));
};

const css = () => {
  return src(path.src.css, { base: `${srcPath}assets/scss/` }, {sourcemaps: true})
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: 'SCSS Error',
            message: 'Error: <%= error.message %>',
          })(err);
          this.emit('end');
        },
      })
    )
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssbeautify())
    .pipe(dest(path.build.css))
    .pipe(
      cssnano({
        zindex: false,
        discardComments: {
          removeAll: true,
        },
      })
    )
    .pipe(removeComments())
    .pipe(
      rename({
        suffix: '.min',
        extname: '.css',
      })
    )
    .pipe(dest(path.build.css), {sourcemaps: '.'})
    .pipe(browserSync.reload({ stream: true }));
};

const img = () => {
  return src(path.src.img, { base: `${srcPath}assets/img/` })
    .pipe(
      imagemin([
        imagemin.gifsicle({ interlaced: true }),
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ])
    )
    .pipe(dest(path.build.img))
    .pipe(webp())
    .pipe(dest(path.build.img))
    .pipe(browserSync.reload({ stream: true }));
};

const svg = () => {
  return src(path.src.svg, { base: `${srcPath}assets/img/` })
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [
            {
              name: 'removeViewBox',
              active: false,
            },
            {
              name: 'removeRasterImages',
              active: true,
            },
            {
              name: 'removeUselessStrokeAndFill',
              active: false,
            },
          ],
        }),
      ])
    )
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(dest(path.build.svg));
};

const js = () => {
  return src(path.src.js, {base: `${srcPath}assets/js/`})
  .pipe(plumber())
  .pipe(concat('main.js'))
  .pipe(dest(path.build.js))
  .pipe(uglify())
  .pipe(rename({
    suffix: ".min",
    extname: ".js"
  }))
  .pipe(dest(path.build.js))
  .pipe(browserSync.reload({ stream: true }));
};

const clean = () => {
  return del(path.clean);
};

const fonts = () => {
  return src(path.src.fonts, { base: `${srcPath}assets/fonts/` })
  .pipe(dest(path.build.fonts))
  .pipe(
    browserSync.reload({ stream: true })
  );
};

const watchFiles = () => {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.img], img);
  gulp.watch([path.watch.svg], svg);
  gulp.watch([path.watch.fonts], fonts);
  gulp.watch([path.watch.js], js)
};

const build = gulp.series(clean, gulp.parallel(html, css, img, svg, js, fonts));
const watch = gulp.series(build, gulp.parallel(watchFiles, serve));

exports.html = html;
exports.css = css;
exports.img = img;
exports.svg = svg;
exports.js = js;
exports.clean = clean;
exports.fonts = fonts;
exports.build = build;
exports.watch = watch;
exports.default = watch;
