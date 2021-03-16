const {src, dest, watch, series} = require('gulp');
const sass = require('gulp-sass');
const run = require('gulp-run-command').default;
const sourcemaps = require('gulp-sourcemaps');

const files = {
    sass_path: "src/scss/**/*.scss",
    js_path: "src/js/**/*.js"
};

const distribution_folder = "dist";

function sass_task() {
    return src(files.sass_path)
        .pipe(sass())
        .pipe(dest(distribution_folder));
}

function js_bundle(cb) {
    run("npx webpack --mode development");
    cb();
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
        series(sass_task, js_bundle)
    );
}

exports.default = series(
    sass_task,
    js_bundle,
    watch_task
);
