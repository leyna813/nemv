var webpackConfig = require('./webpack.config.js');
var gulp = require('gulp');
var webpack = require("webpack");
var express = require('gulp-express');
var git = require('gulp-git');

gulp.task("webpack", function (callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = 'source-map';
    webpack(myConfig, function (err, stats) {
        if (err) {
            console.error(err);
        }
        callback();
    });
});

gulp.task('frontend', ['webpack'], function () {
    gulp.watch(['./app/**/*.vue', './app/**/*.js', './app/**/*.jsx', './app/**/*.html', './views/*.html'], ['webpack']); //Webpack 
});

gulp.task('server', ['webpack'], function () {
    express.run(['index'], {}, 35729); //Start server
    gulp.watch(['./app/**/*.vue', './app/**/*.js', './app/**/*.css', './app/**/*.jsx', './app/**/*.html', './views/*.html'], ['webpack']); //Webpack 
    gulp.watch(['./app/**/*.vue', './app/**/*.js', './app/**/*.jsx', './app/**/*.html', 'views/**/*.jade'], express.notify); //Watch views and app sources file.
    gulp.watch(['./index.js', 'api/**/*.js'], express.run); //Rstart server
});

gulp.task('watchGit', ['build'], function () {
    setInterval(function () {
        git.pull('origin', 'master', { args: '--rebase' }, function (err) {
            if (err) console.error(err);
        });
    }, 60000);
    express.run(['index']); //Start server
    gulp.watch(['./app/**/*.vue', './app/**/*.js', './app/**/*.jsx', './app/**/*.html'], ['build']); //Webpack 
    gulp.watch(['./app/**/*.vue', './app/**/*.js', './app/**/*.jsx', './app/**/*.html', 'views/**/*.jade'], express.notify); //Watch views and app sources file.
    gulp.watch(['./index.js', 'api/**/*.js'], express.run); //Rstart server
});

gulp.task('default', ['server']);

gulp.task('build', function (callback) {
    var myConfig = Object.create(webpackConfig);
    myConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }));
    myConfig.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }));
    webpack(myConfig, function (err, stats) {
        if (err) {
            console.error(err);
        }
        callback();
    });
});