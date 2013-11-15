/*!
 * JATE Ain't a Template Engine
 * https://github.com/fenivana/jate
 * (c) 2013 Allen John <fenivana@noindoin.com>
 * MIT Licensed
 */

'use strict';

function jate(tpl) {
	return jate.compile(tpl);
}

jate.compile = jate.comp = function (tpl) {
	return new Function('data', jate.translate(tpl));
};

jate.translate = function (tpl) {
	var trans = tpl.split(jate.open).join("\x00") // use \x00 as open tag
	               .split(jate.close).join("\x01") // use \x01 as close tag
	               .replace(/(^|\x01)[^\x00]*/g, function (s) { // deal with raw string
	               	return s.replace(/\\/g, "\\\\") // escape \ to \\
	               	        .replace(/'/g, "\\'") // escape ' to \'
	               	        .replace(/\r\n|\r|\n/g, "\\n';\nout += '"); // translate \r\n, \r, \n to \\n';\nout += '
	               })
	               .replace(/\x00=([^\x01]*)\x01/g, "'; out += $1; out += '") // translate <%=expression%> to '; out += expression; out += '
	               .replace(/([^{};\s])(\s*\x01)/g, "$1;$2") // append ; before close tag if omitted. e.g, <% foo() %>
	               .replace(/\x00/g, "';") // replace open tag to ';    (end of raw string)
	               .replace(/\x01/g, "out += '"); // replace close tag to out += '    (start of raw string)
	trans = "var out = '', print = function () {out += Array.prototype.join.call(arguments, '');}; out += '" + trans + "'; return out;";
	return trans;
};

// in order to use on both b/s sides in one page, we need to use different open/close tag.
jate.open = typeof window == 'undefined' ? '<%' : '<:'; // <% in Node, <: in browser
jate.close = typeof window == 'undefined' ? '%>' : ':>'; // %> in Node, :> in browser

if (typeof module != 'undefined' && module.exports) { // node
	module.exports = jate;
} else if (typeof define == 'function' && define.amd) { // amd
	define('jate', [], function () {return jate;});
	define('jate.core', [], function () {return jate;});
}
