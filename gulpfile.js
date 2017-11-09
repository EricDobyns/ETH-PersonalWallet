'use strict'

const gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    minifycss = require('gulp-minify-css'),
    browserSync = require('browser-sync'),
    del = require('del'),
    runSequence = require('run-sequence');


gulp.task('browser-sync', function() {
    browserSync({
        server: {
          baseDir: "./dist"
        }
    });
});

gulp.task('bs-reload', function () {
    browserSync.reload();
});

gulp.task('images', function() {
    gulp.src('src/images/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'));
});

gulp.task('views', function() {
    gulp.src('src/index.html')
    .pipe(gulp.dest('dist'))

    gulp.src('src/views/**/*.html')
    .pipe(gulp.dest('dist/views'))
});

gulp.task('styles', function() {
    gulp.src(['src/styles/**/*.css'])
        .pipe(plumber({
            errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat('styles.css'))
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(gulp.dest('dist/styles/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function() {
    return gulp.src('src/scripts/**/*.js')
        .pipe(plumber({
            errorHandler: function (error) {
            console.log(error.message);
            this.emit('end');
        }}))
        .pipe(concat('scripts.js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts/'))
        .pipe(browserSync.reload({stream:true}))
});

gulp.task('build', function(completion) {
    runSequence('images', 'views', 'styles', 'scripts', completion);
});

gulp.task('clean', function() {
    return del(['dist/**'], {force:true});
});

gulp.task('default', function() {
    runSequence('clean', 'build', 'browser-sync', function() {
        gulp.watch("src/views/**/*.html", ['views']);
        gulp.watch("src/styles/**/*.css", ['styles']);
        gulp.watch("src/scripts/**/*.js", ['scripts']);
        gulp.watch("*.html", ['bs-reload']);
    });
});