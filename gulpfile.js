const gulp = require('gulp');
const runSequence = require('run-sequence');
const gutil = require('gulp-util');
const through = require('through2');
const request = require('request');
const File = require('vinyl');
const source = require('vinyl-source-stream');
const cheerio = require('cheerio');
const _ = require('lodash');

const EMOJI_LIST_URL = 'http://unicode.org/emoji/charts/full-emoji-list.html';
const RAW_DATA_PATH = 'raw';
const EMOJI_LIST_FILE = 'emoji-list.html';

gulp.task('fetch', (cb) => {
  request
    .get(EMOJI_LIST_URL)
    .pipe(source(EMOJI_LIST_FILE))
    .pipe(gulp.dest(RAW_DATA_PATH))
    .on('end', cb);
});

gulp.task('emoji', (cb) => {
  const emojis = {};
  return gulp.src(`${RAW_DATA_PATH}/${EMOJI_LIST_FILE}`)
    .pipe(gutil.buffer())
    .pipe(through.obj((files, enc, cb) => {
      Promise.all(files.map(function (file) {
        return new Promise((resolve, reject) => {
          const $ = cheerio.load(file.contents.toString());
          $('tr').each(function (index) {
            const $tr = $(this);
            if (!$tr.find('.chars').length) {
              // A header row. Skip.
              return;
            }
            const name = $tr.find('.name').first().text();
            if (name.indexOf('skin tone') !== -1) {
              // An emoji of varying skin tone. Skip.
              return;
            }
            const char = $tr.find('.chars').text();
            const keywords = $tr.find('.name').last().text().split('|').map(_.trim);
            const obj = {
              char,
              keywords,
            };
            emojis[char] = obj;
          });
          resolve();
        });
      }))
      .then(() => {
        console.log(`${Object.keys(emojis).length} emojis written.`);
        const file = new File({
          path: `emojis.json`,
          contents: new Buffer(JSON.stringify(emojis, null, 2), 'utf-8')
        });
        cb(null, file);
      });
    }))
    .pipe(gulp.dest('./'));
});

gulp.task('default', function (cb) {
  runSequence('fetch', 'emoji', cb);
});
