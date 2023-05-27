require('whatwg-fetch');
require('@testing-library/jest-dom')

/**
 *  Any subsequent calls to these console functions will effectively be silenced,
 *  preventing their output from being displayed in the console.
 *  This can be useful in testing or production environments where you want to suppress console output
 *  or prevent it from cluttering the console log.
 */
console.error = () => undefined;
console.log = () => undefined;
console.info = () => undefined;
