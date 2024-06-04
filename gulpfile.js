//importerar plugin från npm webbsida
import pkg from 'gulp';
const {src, dest, parallel, series, watch, gulp} = pkg;
import concat from 'gulp-concat';
import terser from 'gulp-terser';
import cssnano from 'gulp-cssnano';
import sharpOptimizeImages from "gulp-sharp-optimize-images";
import babel from 'gulp-babel';
import * as dartSass from 'sass'
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);
import removeHtmlComments from 'gulp-remove-html-comments';

// sökvägar
export const files = {
    htmlPath: "src/*.html",
    CSSPath: "src/css/*.css",
    JSPath: "src/js/*.js",
    imagePath: "src/images/*",
    sassPath: "src/scss/*.scss",
}
//Kopierar html 
export function copyHTML() {
    return src(files.htmlPath)
    .pipe(removeHtmlComments())
    .pipe(dest('docs'));
}

//Kopierar CSS
export function copyCSS() {
    return src(files.CSSPath)
    .pipe(concat('main.css'))
    .pipe(cssnano())
    .pipe(dest('docs/css'));
}
//Kopierar JS
export function copyJS() {
    return src(files.JSPath)
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(babel({
      presets: ['@babel/env']
  }))
    .pipe(dest('docs/js'));
}
// koplimera sass till css
export function compileSass() {
  return src(files.sassPath)
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('docs/css'));
}



//optimerar bilder
export function yourImages() {
    return src(files.imagePath)
      .pipe(
        sharpOptimizeImages({

          avif_to_avif: {
            quality: 8,
            size:90,
          },
 
        })
      )
  
      .pipe(dest("docs/images"));
  }
  

// watch-task
export function watchTask() {
  watch([files.htmlPath, files.CSSPath, files.JSPath, files.imagePath, files.sassPath], 
      series(
          parallel(copyHTML, copyCSS, copyJS, compileSass, yourImages)
      )
  );
}


export default series ( 
    parallel(copyCSS, copyHTML, copyJS,yourImages, compileSass),
    watchTask
)
