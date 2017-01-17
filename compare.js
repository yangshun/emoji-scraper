const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const sorted = require('./sorted.json');
const original = require('./original.json');

function invertMap(obj) {
  const newMap = {};
  for (var key in obj) {
    var value = obj[key];
    if (!newMap[value]) {
      newMap[value] = [];
    }
    newMap[value].push(key);
  }
  if (newMap[value].length > 1) {
    console.log(value, newMap[value]);
  }
  return newMap;
}

const invertedSorted = _.invert(sorted);
const invertedOriginal = _.invert(original);

(() => {
  for (var key in invertedOriginal) {
    if (invertedSorted[key] && invertedSorted[key] !== invertedOriginal[key]) {
      console.log(`@":${invertedOriginal[key]}:": @"${key}",`);
    }
  }
})();
// (() => {
//   for (var key in invertedOriginal) {
//     if (invertedSorted[key] && invertedSorted[key] !== invertedOriginal[key]) {
//       console.log(`@":${key}:": ${invertedSorted[key]} - ${invertedOriginal[key]}`);
//     }
//   }
// })();
