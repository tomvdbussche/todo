let gulp = require('gulp'),
    plugins = require('gulp-load-plugins')();

let src = {
    scripts: ['public/app/**/*.js'],
    styles: ['public/stylesheets/*.scss']
};

let dir = {
    bootstrap: './node_modules/bootstrap-sass/assets/stylesheets',
    scripts: './public/javascripts',
    stylesheets: './public/stylesheets'
};

// JS Lint
gulp.task('js-lint', function () {
    return gulp.src(src.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
});

// SASS Lint

gulp.task('sass-lint', function () {
    return gulp.src(src.styles)
        .pipe(plugins.sassLint())
        .pipe(plugins.sassLint.format());
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(src.scripts)
        .pipe(plugins.concat('app.js'))
        .pipe(plugins.babel())
        .pipe(gulp.dest(dir.scripts))
        .pipe(plugins.rename('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(dir.scripts));
});

// Styles
gulp.task('styles', function () {
    return gulp.src(src.styles)
        .pipe(plugins.sass({
            includePaths: require('node-bourbon').with(dir.bootstrap),
            importer: require('node-sass-import-once')
        }).on('error', plugins.notify.onError(function (error) {
            return "Error: " + error.message;
        })))
        .pipe(gulp.dest(dir.stylesheets))
        .pipe(plugins.rename('styles.min.css'))
        .pipe(plugins.cleanCss())
        .pipe(gulp.dest(dir.stylesheets));
});

// Watch
gulp.task('watch', function () {
    gulp.watch(src.scripts, ['js-lint', 'scripts']);
    gulp.watch(src.styles, ['sass-lint', 'styles']);
});

// Default
gulp.task('default', ['js-lint', 'scripts', 'sass-lint', 'styles', 'watch']);
