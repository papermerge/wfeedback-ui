const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const replace = require('gulp-replace');
const sourcemaps = require('gulp-sourcemaps');

const files = {
    sass_path: "app/scss/**/*.scss",
    js_path: "app/js/**/*.js"
};

const distribution_folder = "dist";

function sass_task() {
    return src(files.sass_path)
        .pipe(sass())
        .pipe(dest(distribution_folder));
}

function js_task() {
    return src(files.js_path)
        .pipe(concat('all.js'))
        .pipe(dest(distribution_folder));
}

/*
function cache_bust_task() {
    let cbString = new Date().getTime();

    return src(['index.html'])
    .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
    .pipe(dest('.'))
}
*/

function watch_task() {
    watch(
        [files.sass_path, files.js_path],
        series(sass_task, js_task)
    );
}

exports.default = series(
    sass_task,
    js_task,
    watch_task
);
