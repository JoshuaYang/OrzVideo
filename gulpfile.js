var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('default', () => {
    return gulp.src(['dev/jsmpg.js', 'dev/orzVideo.js'])
    .pipe(concat('orzvideo.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});
