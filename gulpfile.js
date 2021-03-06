const gulp = require('gulp')
const concat = require('gulp-concat')
const cleanCSS = require('gulp-clean-css')
const imagemin = require('gulp-imagemin')
const terser = require('gulp-terser')

const id = '04122021'

gulp.task('scripts', () => {
    return gulp
        .src('assets/js/*.js')
        .pipe(concat(`scripts-${id}.bundle.js`))
        .pipe(terser({
            compress: true,
            mangle: true
        }))
        .pipe(gulp.dest('public/js'))
})

gulp.task('style', () => {
    return gulp
        .src('assets/css/*.css')
        .pipe(concat(`style-${id}.min.css`))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(gulp.dest('public/css'))
})

gulp.task('images', () => {
    return gulp
        .src('assets/img/*')
        .pipe(imagemin({optimizationLevel: 5}))
        .pipe(gulp.dest('public/img'))
})

gulp.task('bundle-files', gulp.parallel('scripts', 'style', 'images')) 

gulp.task('watch-files', () => {
    gulp.watch('assets/js/*.js', gulp.series('scripts'))
    gulp.watch('assets/css/*.css', gulp.series('style'))
    gulp.watch('assets/img/*', gulp.series('images'))
})