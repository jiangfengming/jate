'use strict';

(function () {
	function jate_jslint(jate, JSLINT) {
		jate.compile = jate.jslint = function(tpl, _opts) {
			var opts = {};
			for (var i in jate.jslint.defaults)
				opts[i] = jate.jslint.defaults[i];
			for (i in _opts)
				opts[i] = _opts[i];

			var trans = jate.translate(tpl);
			JSLINT(trans);
			try {
				var fn = jate._compile(trans, opts);
			} catch (e) {
				var errors = geterrors();
				opts.error(errors, opts);
			}

			if (JSLINT.errors.length) {
				var errors = geterrors();
				opts.warn(errors, opts);
			}

			return fn;

			function geterrors() {
				var errors = [];
				var tpllines = tpl.split(/\r\n|\r|\n/);
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

		jate.jslint.defaults = {
			error: function(errors) {
				console.error(errors)
				throw errors;
			},

			warn: function(errors) {
				console.warn(errors);
			}
		};

		return jate;
	}

	if (typeof jate != 'undefined' && typeof JSLINT != 'undefined') { // browser
		jate_jslint(jate, JSLINT);
	} else if (typeof module != 'undefined' && module.exports){ // node
		module.exports = jate_jslint(require('./jate'), require('jslint')());
	}
})();
