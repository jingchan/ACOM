var gulp = require('gulp');
var webserver = require('gulp-webserver');

var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');

gulp.task('default', ['watch', 'watchify', 'server'], function(){
});

gulp.task('server', function(){
	gulp.src('./dist')
		.pipe(webserver({
			livereload:true,
			open:true,
			
		}));
});

gulp.task('watchify', function(){
	var b = watchify(browserify('./main.js', watchify.args));
	b.on('update', rebundle);

	function rebundle(){
		return b.bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify error'))
			.pipe(source('bundle.js'))
			.pipe(gulp.dest('dist'));
	}
	return rebundle();
});

gulp.task('watch', function(){
	gulp.watch('public/**/*', ['copy']);
});
gulp.task('copy', function(){
	gulp.src('public/**/*')
		.pipe(gulp.dest('dist'));
		
});