const { series, parallel} = require('gulp')
const gulp = require('gulp')
const concat = require('gulp-concat')
const cssmin = require('gulp-cssmin')
const rename = require('gulp-rename')
const uglify = require('gulp-uglify')
const stripCss = require('gulp-strip-css-comments')
const htmlmin = require('gulp-htmlmin')
const babel = require('gulp-babel')
const browserSync = require('browser-sync').create()
const sass = require('gulp-sass')( require('node-sass'))
const { pipe } = require('stdout-stream')
const { contains } = require('jquery')
const reload = browserSync.reload

function tarefasCSS(cb) {

    gulp.src([
            // './node_modules/bootstrap/dist/css/bootstrap.css',
            './dist/css/style.css'
        ])
        .pipe(stripCss())                   // remove comentários css   
        .pipe(concat('styles.css'))           // mescla arquivos
        .pipe(cssmin())                     // minifica css
        .pipe(rename({ suffix: '.min'}))    // libs.min.css
        .pipe(gulp.dest('./dist/css'))      // cria arquivo em novo diretório

    cb()

}

function tarefasSASS(cb) {
    
    gulp.src('./src/scss/**/*.scss')
        .pipe(sass()) // transforma o sass para css 
        .pipe(gulp.dest('./dist/css')) 

    cb()
}

function tarefasJS(callback){

    gulp.src([
            // './node_modules/jquery/dist/jquery.js',
            // './node_modules/bootstrap/dist/js/bootstrap.js',
            // './vendor/owl/js/owl.js',
            // './vendor/jquery-mask/jquery.mask.js',
            // './vendor/jquery-ui/jquery-ui.js',
            './src/js/custom.js'
        ])
        .pipe(babel({
            comments: false,
            presets: ['@babel/env']
        }))
        .pipe(concat('scripts.js'))         // mescla arquivos
        .pipe(uglify())                     // minifica js
        .pipe(rename({ suffix: '.min'}))    // scripts.min.js
        .pipe(gulp.dest('./dist/js'))       // cria arquivo em novo diretório

    return callback()
}

// POC - Proof of Concept
function tarefasHTML(callback){

    gulp.src('./src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('./dist'))

    return callback()

}

gulp.task('serve', function(){

    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch('./src/**/*').on('change', process) // repete o processo quando alterar algo em src
    gulp.watch('./src/**/*').on('change', reload)

})

// series x parallel
const process = parallel( tarefasSASS, tarefasHTML, tarefasJS, tarefasCSS )

exports.styles = tarefasCSS
exports.scripts = tarefasJS
exports.sass = tarefasSASS

exports.default = process