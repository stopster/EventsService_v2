'use strict';

// Probably, there is some nice middleware for browser detection, but I didn't find one
// So, do the basic detection of name and version, it should be enough
module.exports = (userAgent) => {
  const match = userAgent? userAgent.match(/(\w+)\/(\d\d)\./): '';
  return {
    name: match && match[1]? match[1]: 'N/A',
    version: match && match[2]? match[2]: '0'
  };
};
