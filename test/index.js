var rework = require('rework');
var unique = require('../');
var diff = require('diff');
var fs = require('fs');
var FILE = 'test/css/';

function test(type) {
  var actual = rework(fs.readFileSync(FILE + type + '.css', 'utf8'))
    .use(unique())
    .toString()
    .trim();
  var expected = fs.readFileSync(FILE + type + '.out.css', 'utf8').trim();
  if (actual !== expected) {
    var error = 'Failed!\n';
    var result = diff.diffLines(expected, actual);
    for (var i = 0, len = result.length; i < len; i += 1) {
      var d = result[i];
      if (d.added) {
        error += '[+] ' + d.value;
      } else if (d.removed) {
        error += '[-] ' + d.value;
      } else {
        error += '    ' + d.value;
      }
    }
    throw new Error(error);
  }
  console.log(type + ' test passed!');
}


test('no-matches');
test('matches');
try {
  test('invalid-matches');
} catch(e) {
  if (e.message.indexOf('sequential :matches') !== -1) {
    console.log('invalid-matches test passed!');
  } else {
    throw e;
  }
}
