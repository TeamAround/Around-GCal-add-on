/**
 *  Fill empty spaces
 * 
 *  @param {count} Number of spaces
 *  @return {string}
 */
var fillSpace = function(count) {
  var space = "";
  for (var i = 0; i < count; i++) {
    space += "&nbsp;"; 
  }
  return space;
}
