(function () {
	'use strict';

	function jate_jshint(jate, JSHINT) {
		jate.compile = jate.jshint = function(tpl) {
			var trans = jate.translate(tpl);
			JSHINT(trans);
			try {
				var fn = new Function('data', trans);
			} catch (e) {
				var errors = geterrors();
				console.error(errors);
				throw errors;
			}

			if (JSHINT.errors.length) {
				var errors = geterrors();
				console.warn(errors);
			}

			return fn;

			function geterrors() {
				var errors = [],
					tpllines = tpl.split(/\r\n|\r|\n/);
				for (var i = 0; i < JSHINT.errors.length; i++) {
					var err = JSHINT.errors[i];
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

	if (typeof jate != 'undefined' && typeof JSHINT != 'undefined') { // browser
		jate_jshint(jate, JSHINT);
	} else if (typeof module != 'undefined' && module.exports){ // node
		module.exports = jate_jshint(require('./jate.js'), require('jshint').JSHINT);
	} else if (typeof define == 'function' && define.amd) { // amd
		define(['jate.core', 'jshint'], function (jate) {
			return jate_jshint(jate, JSHINT);
		});
	}
})();
