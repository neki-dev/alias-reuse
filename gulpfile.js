const gulp = require("gulp");
const ts = require("gulp-typescript");
const merge = require("merge2");
const uglify = require('gulp-uglify');
const tsConfig = require('./tsconfig.json');

gulp.task("default", function () {
  const tsResult = gulp.src('src/**/*.ts').pipe(ts(tsConfig.compilerOptions));
  return merge([
    tsResult.js.pipe(uglify()),
    tsResult.dts, 
  ]).pipe(gulp.dest('dist/'));
});