module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig ({
		uglify: {
			dist: {
				files: {
					'WebSocket.min.js': 'WebSocket.js'
				}
			}
		} ,
		jshint: {
			dist: {
				options: {
					globals: {
						Ext: true
					} ,
					eqeqeq: true ,
					undef: true ,
					eqnull: true ,
					browser: true ,
					smarttabs: true ,
					loopfunc: true
				} ,
				src: ['WebSocket.js']
			}
		}
	});

	grunt.registerTask ('check', ['jshint']);
	grunt.registerTask ('minify', ['uglify']);
	grunt.registerTask ('build', ['check', 'minify']);
};
