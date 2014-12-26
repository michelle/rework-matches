var COMMA_PLACEHOLDER = '&';
var MATCH_REGEX = /:matches\(([^\(\)]+)\)/g;

// TODO: what about :matches(...):matches(...) ?
module.exports = function() {
  function addCartesianSelectors(selector, matchesParts, values, arr) {
    var max = matchesParts.length - 1;

    // Need to pass current string.
    function helper(str, i) {
      for (var j = 0, l = values[i].length; j < l; j += 1) {
        var newstr = str.replace(matchesParts[i], values[i][j]);
        if (i === max) {
          arr.push(newstr);
        } else {
          helper(newstr, i + 1);
        }
      }
    }

    helper(selector, 0);
    return arr;
  }

  return function(style) {
    style.rules.forEach(function replaceMatches(rule) {
      if (rule.rules) {
        rule.rules.forEach(replaceMatches);
      }

      // Unfortunately rework unconditionally splits selectors by comma, so our
      // :matches(...) selector gets munged.
      var actualSelectors = rule.selectors.join(',').replace(/:matches\(.*\)/g, function(substr) {
        return substr.replace(/,/g, COMMA_PLACEHOLDER);
      }).split(',');
      rule.selectors = actualSelectors;
      rule.selectors.forEach(function findMatchesSelector(selector, i) {
        var options, match, values, matches, lastIndex;
        if (selector.indexOf(':matches(') !== -1) {
          values = [];
          matches = [];


          while (match = MATCH_REGEX.exec(selector)) {
            if (match[1].indexOf(':matches(') !== -1 || match[1].indexOf(':not(') !== -1) {
              throw new Error(
                'Cannot nest :matches(...) or :not(...) in :matches(...) selector: ' +
                selector
              );
            } else if (lastIndex === match.index) {
              throw new Error(
                'Cannot have sequential :matches in selector: ' +
                selector
              );
            }

            matches.push(match[0]);
            values.push(match[1].split(COMMA_PLACEHOLDER));
            lastIndex = MATCH_REGEX.lastIndex;
          }

          rule.selectors.splice(i, 1);
          addCartesianSelectors(selector, matches, values, rule.selectors);
        }
      });
    });
  };
};
