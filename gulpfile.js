const gulp = require('gulp')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const terser = require('gulp-terser')
const strip = require('gulp-strip-comments')
const randomstring = require('randomstring')

const idJS = randomstring.generate({
    length: 15
});

const idCSS = randomstring.generate({
    length: 15
})

// Minify js files
gulp.task('scripts', () => {
    return gulp
        .src('assets/js/*.js')
        .pipe(strip())
        .pipe(concat(`scripts-${idJS}.bundle.js`))
        .pipe(terser({
            compress: true,
            mangle: true
        }))
        .pipe(gulp.dest('public/js'))
})

// Minify css files
gulp.task('style', () => {
    return gulp
        .src('assets/css/*.css')
        .pipe(concat(`style-${idCSS}.min.css`))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/css'))
})

// Optimize images
gulp.task('images', () => {
    return gulp
        .src('assets/img/*')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('public/img'))
})

// Move all library to public file
gulp.task('move-library', () => {
    return gulp
        .src('assets/lib/*.js')
        .pipe(strip())
        .pipe(concat(`confetti.bundle.js`))
        .pipe(terser({
            compress: true,
            mangle: true
        }))
        .pipe(gulp.dest('public/lib'))
})

gulp.task('minify-files', gulp.parallel('scripts', 'style', 'images', 'move-library')) 

gulp.task('watch-files', () => {
    gulp.watch('assets/js/*.js', gulp.series('scripts'))
    gulp.watch('assets/css/*.css', gulp.series('style'))
    gulp.watch('assets/img/*', gulp.series('images'))
    gulp.watch('assets/lib/*.js', gulp.series('move-library'))
})