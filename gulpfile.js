var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

var src = {
    scripts: ['app/**/*.js', 'app/*.js'],
    styles: ['app/styles/*.scss']
};

var dist = {
    scripts: './public/javascripts',
    stylesheets: './public/stylesheets'
};

// Lint
gulp.task('lint', function () {
    return gulp.src(src.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(src.scripts)
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dist.scripts));
});

// Styles
gulp.task('styles', function () {
    return gulp.src(src.styles)
        .pipe(plugins.sass({
            includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets']
        }).on('error', plugins.notify.onError(function (error) {
            return "Error: " + error.message;
        })))
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(dist.stylesheets));
});

// Watch
gulp.task('watch', function () {
    gulp.watch(src.scripts, ['lint', 'scripts']);
    gulp.watch(src.styles, ['styles']);
});

// Default
gulp.task('default', ['lint', 'scripts', 'styles', 'watch']);
