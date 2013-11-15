(function () {
	'use strict';

	function jate_jslint(jate, JSLINT) {
		jate.compile = jate.jslint = function(tpl) {
			var trans = jate.translate(tpl);
			JSLINT(trans);
			try {
				var fn = new Function('data', trans);
			} catch (e) {
				var errors = geterrors();
				console.error(errors);
				throw errors;
			}

			if (JSLINT.errors.length) {
				var errors = geterrors();
				console.warn(errors);
			}

			return fn;

			function geterrors() {
				var errors = [],
					tpllines = tpl.split(/\r\n|\r|\n/);
				for (var i = 0; i < JSLINT.errors.length; i++) {
					var err = JSLINT.errors[i];
					errors.push({
						description: err.reason,
						translation: err.evidence,
						template: tpllines[err.line - 1],
						line: err.line,
						column: err.character,
						code: err.code,
					});
				}
				return {errors: errors, template: tpl, translation: trans};
			}
		};

		return jate;
	}

	if (typeof jate != 'undefined' && typeof JSLINT != 'undefined') { // browser
		jate_jslint(jate, JSLINT);
	} else if (typeof module != 'undefined' && module.exports){ // node
		module.exports = jate_jslint(require('./jate.js'), require('jslint')());
	} else if (typeof define == 'function' && define.amd) { // amd
		define(['jate.core', 'jslint'], function (jate) {
			return jate_jslint(jate, JSLINT);
		});
	}
})();
