
let progect_folder="dist";
let source_folder = "#src";

let path = {
    build: {
        html: progect_folder + "/",
        css: progect_folder + "/css/",
        js: progect_folder + "/js/",
        img: progect_folder + "/img/",
        fonts: progect_folder + "/fonts/",
    },
    src: {
        html: [source_folder + "/*.html", "!"+source_folder + "/_*.html"],
        css: source_folder + "/scss/style.scss", //Исходник файла scss файл
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.ttf",
    },
    watch: {
        html: source_folder + "/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}"
    },
    clean: "./" + progect_folder + "/"
}

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browsersync = require("browser-sync").create();
let fileinclude = require("gulp-file-include");
let del = require("del");
let scss = require('gulp-sass')(require('sass'));
let autoprefixer = require("gulp-autoprefixer");
let group_media = require("gulp-group-css-media-queries");
let clean_css = require("gulp-clean-css");
let rename = require("gulp-rename");
let uglify = require("gulp-uglify-es").default;
let imagemin = require("gulp-imagemin");
let webp = require('gulp-webp');
let webphtml = require('gulp-webp-html');
let webpcss = require("gulp-webpcss");
let svgSprite = require('gulp-svg-sprite')

function browserSync(params) {
    browsersync.init({
        server:{
            baseDir: "./" + progect_folder + "/"
        },
        port:3000,
        notify:false
    })
}

function html() {
    return src(path.src.html)
        .pipe(fileinclude())
        .pipe(webphtml())
        .pipe(dest(path.build.html))
        .pipe(browsersync.stream())  //Перезагрузка браузера
}

function css() {
    return gulp.src(path.src.css)
    .pipe(
        scss({
            outputStyle: "expanded" // Не зжимаэ файл
        })
    )
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            overrideBrowserslist: ["last 5 versions"],
            cascade: true
        })
    )
    
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())  
}

function js() {
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}

function images() {         //Картинки 
    return src(path.src.img)
        .pipe(
            webp({              // Зжимаэ картинку не втрачуючи її якість 
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
            .pipe(
                imagemin({
                progressive: true,
                svgoPlugins: [{ removeViewBox: false }],
                interlaced: true,
                optimizationLevel: 3 // 0 to 7
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())  
}

function watchFiles(params) {           //Подключем просмотр 
    gulp.watch([path.watch.html], html);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean(params) {
    return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js,css, html, images)); // обробка функцый
let watch=gulp.parallel(build, watchFiles, browserSync);

exports.images =images;
exports.js =js;
exports.css =css;
exports.build = build;
exports.html = html;
exports.watch = watch;
exports.default = watch;
