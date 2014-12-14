'use strict';

var gulp = require('gulp');
var connect = require('gulp-connect');

var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var watchify = require('watchify');
var browserify = require('browserify');
var browserifyshim = require('browserify-shim');
var watch = require('gulp-watch');

gulp.task('default', ['watch', 'watchify', 'server'], function(){

});

gulp.task('server', ['watchify'], function(){
	connect.server({
		root: 'dist',
		livereload: true,
		port: 8000
	});

});

gulp.task('watchify', function(){
	var b = watchify(browserify('./main.js', watchify.args));
	b.transform(browserifyshim);
	b.on('update', rebundle);

	function rebundle(){
		return b.bundle()
			.on('error', gutil.log.bind(gutil, 'Browserify error'))
			.pipe(source('bundle.js'))
			.pipe(gulp.dest('dist'))
			.pipe(connect.reload());
	}
	return rebundle();
});

gulp.task('watch', function(){
	gulp.src('public/**/*')
		.pipe(watch('public/**/*'))
		.pipe(gulp.dest('./dist/'))
		.pipe(connect.reload());
});

gulp.task('copy', function(){
	gulp.src('public/**/*')
		.pipe(gulp.dest('./dist/'));
		
});
