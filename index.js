const _ = require('lodash');
const fs = require('fs');
const emojis = require('emojione/emoji.json');
const emojiScraped = require('./emojis.json');

function generateEmoji(obj) {
  const unicode = obj.unicode_alt || obj.unicode;
  return eval('"' + unicode.split('-').map((fragment) => `\\u{${fragment}}`).join('') + '"');
}

const uniqueEmojis = {};
_.forEach(emojis, (value, shortname) => {
  if (value.unicode.indexOf('-') > -1 && shortname.indexOf('tone') > -1) {
    // Skin tone emoji
    return;
  }
  if (value.category === 'modifier') {
    return;
  }
  uniqueEmojis[shortname] = Object.assign({}, value, {
    char: generateEmoji(value),
  });
});

fs.writeFile('unique-emojis.json', JSON.stringify(uniqueEmojis, null, 2));

// console.log(uniqueEmojis);
