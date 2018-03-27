var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del'),
    htmlmin = require('gulp-htmlmin'),
    templateCache = require('gulp-angular-templatecache'),
    bom = require('gulp-bom');

var src = "./src/",
    dist = "./cdist/"

//清除
gulp.task('clean', function() {
    return del(dist);
});

//模板
gulp.task('view', function() {
    var htmlMinOptions = {
        collapseWhitespace: true, //压缩HTML
        removeEmptyAttributes: true, //删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true, //删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true, //删除<style>和<link>的type="text/css"
        minifyJS: true, //压缩页面JS
        minifyCSS: true //压缩页面CSS
    };

    return gulp.src(src + 'views/**/*.html')
        .pipe(htmlmin(htmlMinOptions))
        .pipe(templateCache({
            standalone: true,
            root: "views"
        }))
        .pipe(gulp.dest(dist + 'views'));
});

//图片
gulp.task('image', function() {
    gulp.src([src + 'images/**/*'])
        .pipe(gulp.dest(dist + 'images'));
});

//脚本
gulp.task('script', function() {
    var path = src + "lib/";

    gulp.src([
            path + 'jquery/dist/jquery.min.js',
            path + 'angular/angular.min.js',
            path + 'bootstrap/dist/js/bootstrap.min.js',
            path + 'angular-animate/angular-animate.min.js',
            path + 'angular-cookies/angular-cookies.min.js',
            path + 'angular-promise-tracker/promise-tracker.min.js',
            path + 'angular-resource/angular-resource.min.js',
            path + 'angular-route/angular-route.min.js',
            path + 'angular-sanitize/angular-sanitize.min.js',
            path + 'angular-ui-router/release/angular-ui-router.min.js',
            path + 'moment/min/moment.min.js',
            path + 'moment/locale/zh-cn.js'
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(dist + 'scripts'));

    gulp.src([src + 'scripts/baseModule.js',
            src + 'scripts/pages/**/*.js',
            src + 'scripts/components/**/*.js',
            src + 'scripts/thirdparty/ZeroClipboard.js',
            src + 'scripts/thirdparty/clipboard.min.js',
            src + 'scripts/export.js',
            src + 'scripts/thirdparty/jquery.location.js',
            src + 'scripts/thirdparty/jquery.extend.js',
            src + 'scripts/thirdparty/paging.js',
            src + 'scripts/thirdparty/jquery.sharing.js'
        ])
        .pipe(concat('common.js'))
        /*.pipe(uglify({
            mangle: false
        }))*/
        .pipe(bom())
        .pipe(gulp.dest(dist + 'scripts'));

    gulp.src([src + 'scripts/thirdparty/kindeditor/**', '!' + src + 'scripts/thirdparty/kindeditor/plugins/**   '])
        .pipe(gulp.dest(dist + 'scripts/kindeditor'));


    gulp.src([src + 'scripts/thirdparty/highcharts.js'])
        .pipe(gulp.dest(dist + 'scripts'));


    gulp.src([src + 'scripts/thirdparty/datepicker/**'])
        .pipe(gulp.dest(dist + 'scripts/datepicker'));

    gulp.src([src + 'scripts/frame.js'])
        .pipe(gulp.dest(dist + 'scripts'));
});

//样式
gulp.task('style', function() {
    gulp.src(src + 'lib/datepicker/skin/**')
        .pipe(gulp.dest(dist + '/styles/datepicker'));

    gulp.src(src + 'lib/bootstrap/dist/css/**')
        .pipe(gulp.dest(dist + '/styles/bootstrap/css'));

    gulp.src(src + 'lib/bootstrap/dist/fonts/**')
        .pipe(gulp.dest(dist + '/styles/bootstrap/fonts'));

    gulp.src(src + 'styles/thirdparty/**')
        .pipe(gulp.dest(dist + '/styles/thirdparty'));

    //编译sass
    gulp.src(src + 'styles/common.scss')
        .pipe(sass())
        //添加前缀
        .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
        //保存未压缩文件到我们指定的目录下面
        .pipe(gulp.dest(dist + 'styles'))
        //给文件添加.min后缀
        .pipe(rename({
            suffix: '.min'
        }))
        //压缩样式文件
        .pipe(minifycss())
        //输出压缩文件到指定目录
        .pipe(gulp.dest(dist + 'styles'))
});

//编译
gulp.task('build', ['clean'], function() {
    gulp.start('view', 'image', 'script', 'style');
});
