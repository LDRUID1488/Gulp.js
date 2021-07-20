let prod = "dist";
let source = "src";

let path = {
    build: {
        html: prod + "/",
        css: prod + "/css/",
        js: prod + "/js/",
        img: prod + "/img/",
        fonts: prod + "/fonts/"
    },
    src: {
        html: [source + "/*.html", "!"+source+"/_*.html"],
        css: source + "/css/style.scss",
        js: source + "/js/js.js",
        img: source + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source + "/fonts/"
    },
    watch: {
        html: source + "/**/*.html",
        css: source + "/css/**/*.scss",
        js: source + "/js/**/*.js",
        img: source + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source + "/fonts/"
    },
    clean: "./" + prod + "/"
}

const del = require('del');
let { src, dest } = require('gulp');
const fileinclude = require('gulp-file-include');
gulp = require('gulp'),
    browsync = require('browser-sync').create();
    scss = require('gulp-sass')(require('sass'));
    

function bSync() {
    browsync.init({
        server: {
            baseDir: "./" + prod + "/"
        },
        port:8080,
        notify:false
    })
}
function html(){
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(dest(path.build.html))
        .pipe(browsync.stream())
}

// scss
function css(){
    return src(path.src.css)
        .pipe(
            scss({
                outputStyle:'expanded'
            })
        )
        .pipe(dest(path.build.css))
        .pipe(browsync.stream())
}

// img
function img(){
    return src(path.src.img)
        .pipe(dest(path.build.img))
        .pipe(browsync.stream())
}
// reload with me 
function watchMe(){
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.img],img)
}

// delete dist automatical
function delDist(){
    return del(path.clean)
}

let build = gulp.series(delDist,gulp.parallel(html,css,img));
let watch = gulp.parallel(build,watchMe,bSync);

exports.img = img;
exports.css = css;
exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
