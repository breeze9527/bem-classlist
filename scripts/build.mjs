import gulp from 'gulp';
import terser from 'gulp-terser';
import { babel } from '@rollup/plugin-babel';
import rollup from 'gulp-better-rollup';
import rename from 'gulp-rename';

const ES_DIR = 'es';
const UMD_DIR = 'umd';
function buildUMD() {
  return gulp.src(`${ES_DIR}/index.js`)
    .pipe(rollup(
      {
        plugins:[
          babel({
            babelHelpers: 'bundled'
          }),
        ]
      },
      {
        file: 'index.js',
        format: 'umd',
        name: 'bem',
        plugins: [],
      }
    ))
    .pipe(gulp.dest(UMD_DIR));
}

function minify() {
  return gulp.src(`${UMD_DIR}/*.js`)
    .pipe(terser())
    .pipe(rename(path => {
      path.basename += '.min'
    }))
    .pipe(gulp.dest(UMD_DIR));
}

const build = gulp.series(
  buildUMD,
  minify
);

build();
