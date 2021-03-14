const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');

const files = {
    sass_path: "app/scss/**/*.scss",
    js_path: "app/js/**/*.js"
};

function sass_task() {
    return src(files.sass_path)
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('dist'));
}

function js_task() {
    return src(files.js_path)
        .pipe(concat('all.js'))
        .pipe(dest('dist'));
}

function cache_bust_task() {
    return src(['index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.'))
}

function watch_task() {
    watch(
        [files.scss_path, files.js_path],
        parallel(sass_task, js_task)
    )
}

exports.default = series(
    parallel(sass_task, js_task),
    cache_bust_task,
    watch_task
);
