const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const allEmojis = require('./unique-emojis.json');

var emojis = _.mapValues(allEmojis, (value, key, emoji) => {
  return Object.assign(value, { name: key });
});

const orderedGroups = [ 
  'people',
  'nature',
  'food',
  'activity',
  'travel',
  'objects',
  'symbols',
  'flags'
];
const groupedEmojis = _.groupBy(emojis, (emoji) => emoji.category);
const sortedGroupedEmojis = _.mapValues(groupedEmojis, (emojiGroup) => {
  return _.sortBy(emojiGroup, (emoji) => {
    return parseInt(emoji.emoji_order);
  });
});

var final = '';
var finalJson = {};
orderedGroups.forEach((group) => {
  final += `// ${_.startCase(group)}\n`;
  sortedGroupedEmojis[group].forEach((emoji) => {
    final += `@":${emoji.name}:": @"${emoji.char}",\n`;
    finalJson[emoji.name] = emoji.char;
  });
});
fs.writeFile('sorted.txt', final);
fs.writeFile('sorted.json', JSON.stringify(finalJson, null, 2));
