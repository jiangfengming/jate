(function () {
	'use strict';

	function jate_esprima(jate, esprima) {
		jate.compile = jate.esprima = function(tpl) {
			var trans = jate.translate(tpl);
			try {
				return new Function('data', trans);
			} catch (e) {
				try {
					esprima.parse(trans);
				} catch (e) {
					var tpllines = tpl.split(/\r\n|\r|\n/),
					    translines = trans.split(/\r\n|\r|\n/),
					    errors = {
							template: tpl,
							translation: trans,
							errors: [{
								description: e.description,
								translation: translines[e.lineNumber - 1],
								template: tpllines[e.lineNumber - 1],
								line: e.lineNumber,
								column: e.column
							}]
						};
					console.error(errors);
					throw errors;
				}
			}
		};
		
		return jate;
	}

	if (typeof jate != 'undefined' && typeof esprima != 'undefined') { // browser
		jate_esprima(jate, esprima);
	} else if (typeof module != 'undefined' && module.exports){ // node
		module.exports = jate_esprima(require('./jate.js'), require('esprima'));
	} else if (typeof define == 'function' && define.amd) { // amd
		define(['jate.core', 'esprima'], function (jate, esprima) {
			return jate_esprima(jate, esprima);
		});
	}
})();
