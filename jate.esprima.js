'use strict';

(function () {
	function jate_esprima(jate, esprima) {
		jate.compile = jate.esprima = function(tpl, _opts) {
			var opts = {};
			for (var i in jate.esprima.defaults)
				opts[i] = jate.esprima.defaults[i];
			for (i in _opts)
				opts[i] = _opts[i];

			var trans = jate.translate(tpl);
			try {
				return jate._compile(trans, opts);
			} catch (e) {
				try {
					esprima.parse(trans);
				} catch (e) {
					var tpllines = tpl.split(/\r\n|\r|\n/);
					var translines = trans.split(/\r\n|\r|\n/);
					var errors = {
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
					opts.error(errors, opts);
				}
			}
		};

		jate.esprima.defaults = {
			error: function(errors) {
				console.error(errors);
				throw errors;
			}
		};
		
		return jate;
	}

	if (typeof jate != 'undefined' && typeof esprima != 'undefined') { // browser
		jate_esprima(jate, esprima);
	} else if (typeof module != 'undefined' && module.exports){ // node
		module.exports = jate_esprima(require('./jate'), require('esprima'));
	}
})();
