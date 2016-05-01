var gulp = require('gulp')
var nodemon = require('gulp-nodemon')


gulp.task('node', function () {
  nodemon({
    script: 'server.js',
    ext: 'js html',
    env: { 'NODE_ENV': 'development' },
    ignore: "./public/"
  })
})



gulp.task('default', ['node'])
