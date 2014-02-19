(function () {
	'use strict';

	function jate_jshint(jate, JSHINT) {
		jate.compile = jate.jshint = function(tpl, _opts) {
			var opts = {};
			for (var p in jate.jshint.default)
				opts[p] = jate.jshint.default[p];
			for (p in _opts)
				opts[p] = _opts[p];

			var trans = jate.translate(tpl);
			JSHINT(trans);
			try {
				var fn = new Function('data', trans);
			} catch (e) {
				var errors = geterrors();
				opts.error(errors, opts);
			}

			if (JSHINT.errors.length) {
				var errors = geterrors();
				opts.warn(errors, opts);
			}

			return fn;

			function geterrors() {
				var errors = [];
				var tpllines = tpl.split(/\r\n|\r|\n/);
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

		jate.jshint.default = {
			error: function(errors) {
				console.error(errors);
				throw errors;
			},

			warn: function(errors) {
				console.warn(errors);
			}
		};

		return jate;
	}

	if (typeof jate != 'undefined' && typeof JSHINT != 'undefined') { // browser
		jate_jshint(jate, JSHINT);
	} else if (typeof module != 'undefined' && module.exports){ // node
		module.exports = jate_jshint(require('./jate'), require('jshint').JSHINT);
	}
})();
