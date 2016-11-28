var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

var src = {
    scripts: ['src/**/*.js', 'src/*.js'],
    styles: ['src/styles/*.scss']
};

var dist = {
    scripts: './dist/javascripts',
    stylesheets: './dist/stylesheets'
};

// Lint
gulp.task('lint', function () {
    return gulp.src('source/javascript/**/*.js')
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(src.scripts)
        .pipe(plugins.concat('src.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dist.scripts));
});

// Styles
gulp.task('styles', function () {
    return gulp.src('./src/styles/*.scss')
        .pipe(plugins.sass())
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
