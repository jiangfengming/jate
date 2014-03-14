'use strict';

(function () {
	function jate_jshint(jate, JSHINT) {
		jate.compile = jate.jshint = function(tpl, _opts) {
			var opts = {};
			for (var i in jate.jshint.defaults)
				opts[i] = jate.jshint.defaults[i];
			for (i in _opts)
				opts[i] = _opts[i];

			var trans = jate.translate(tpl);
			JSHINT(trans);
			try {
				var fn = jate._compile(trans, opts);
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

		jate.jshint.defaults = {
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
