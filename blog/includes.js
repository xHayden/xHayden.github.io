/**
 * Select objects in array whose key includes a value
 *
 * @param {Array} arr Array to test
 * @param {String} key Key to inspect
 * @param {String} value Value key needs to include
 * @return {String} Filtered array
 *
 */
module.exports = function (arr, key, value) {
    if (arr.includes(value)) {
        return true;
    } else {
        return false;
    }
};