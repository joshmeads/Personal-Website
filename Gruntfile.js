module.exports = function(grunt) {

	 grunt.initConfig({

	// Configure tasks
	//-----------------

		copy: {
			build: {
				cwd: 'src',
				src: [ '**', '!**/*.scss', '!**/*.sass', '!sass/**', '!**/*.psd' ],
				dest: 'build',
				expand: true
			},
			deploy: {
				cwd: 'build',
				src: [ '**' ],
				dest: 'deploy',
				expand: true
			},
			svg: {
				cwd: 'src',
				src: [ '**/*.svg' ],
				dest: 'build',
				expand: true
			},
			js: {
				cwd: 'src/js',
				src: [ '**/*.js' ],
				dest: 'build/js',
				expand: true
			},
		},
 
		clean: {
			build: {
				src: [ 'build' ]
			},
			deploy: {
				src: [ 'deploy' ]
			},
			junk: {
				src: [ 'deploy/**/*.js', 'deploy/**/*.css', '!deploy/**/*.min.js', '!deploy/**/*.min.css' ]
			},
		},

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'build/css/core.css': 'src/sass/core.scss',
				}
			}
		},

		autoprefixer: {
			build: {
				expand: true,
				cwd: 'build/css',
				src: [ '**/*.css', '!**/*.min.css' ],
				dest: 'build/css'
			}
		},

		cssmin: {
			build: {
				files: [{
					expand: true,
					cwd: 'build/css/',
					src: ['*.css', '!*.min.css'],
					dest: 'build/css/',
					ext: '.min.css'
				}]
			},
			webfonts: {
				files: [{
					expand: true,
					cwd: 'build/webfonts/',
					src: ['*.css', '!*.min.css'],
					dest: 'build/webfonts/',
					ext: '.min.css'
				}]
			}
		},

		uglify: {
			options: {
				sourceMap: false
			},
			build: {
				files: {
					'build/js/scripts.min.js':
					['src/js/libs/*.js', 'src/js/*.js', '!src/js/nocompile/*.js'],
				}
			}
		},

		imagemin: {
			png: {
				options: {
					optimizationLevel: 5 //Compression level 1-7 (7 = highest)
				},
				files: [{
					expand: true, //Dynamic expansion
					cwd: 'build/img',
					src: ['**/*.png'],
					dest: 'build/img/',
					ext: '.png'
				}]
			},
			jpg: {
				options: {
				progressive: true //Lossless or progressive conversion
				},
				files: [{
					expand: true,
					cwd: 'build/img',
					src: ['**/*.jpg'],
					dest: 'build/img/',
					ext: '.jpg'
				}]
			}
		},

		svgmin: {
			options: {
				plugins: [
						{
								removeViewBox: false
						}, {
								removeUselessStrokeAndFill: false
						}
				]
			},
	  dist: {
			expand: true,
			cwd: 'src/img',
			src: ['**/*.svg'],
			dest: 'build/img',
			ext: '.min.svg'
			}
		},


		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'deploy/index.html': 'build/index.html'
				}
			}
		  },

		penthouse: {
			extract : {
				outfile : 'storage/critical.css',
				css : 'build/css/core.css',
				url : 'build/index.html',
				width : 1300,
				height : 900
			},
		},


		watch: {
			options: {
				livereload: true,
			},
			stylesheets: {
				files: 'src/sass/**/*.scss',
				tasks: [ 'stylesheets' ]
			},
			scripts: {
				files: 'src/js/**/*.js',
				tasks: [ 'javascript' ]
			},
			svg: {
				files: 'src/img/**/*.svg',
				tasks: [ 'copy:svg' ]
			},
			svgmin: {
				files: 'src/img/**/*.svg',
				tasks: [ 'svgmin' ]
			},
			copy: {
				files: [ 'src/**', '!src/sass/**/*.scss', '!src/js/**/*.js' ],
				tasks: [ 'copy' ]
			}
		},

		connect: {
			server: {
				options: {
					port: 4000,
					base: 'build',
					hostname: '*'
				}
			}
		},

		exec: {
			divshot: {
				command: 'divshot push'
			}
		}

	});




	// Load the tasks
	//-----------------

	// Core
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');

	grunt.loadNpmTasks('grunt-penthouse');

	grunt.loadNpmTasks('grunt-newer'); //Not working?
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.loadNpmTasks('grunt-exec');


	// Define the tasks
	//-----------------

	grunt.registerTask( // Stylesheets
	'stylesheets', 
	'Compiles Stylesheets', 
	[ 'sass', 'autoprefixer', 'cssmin:build', 'cssmin:webfonts' ]
	);

	grunt.registerTask( // Javascript
	'javascript', 
	'Compiles Javascript', 
	[ 'copy:js', 'uglify']
	);

	grunt.registerTask( // Images
	'images', 
	'Compresses images', 
	[ 'imagemin', 'svgmin']
	);

	grunt.registerTask( // Build Files
	'build', 
	'Remakes build folder from scratch', 
	[ 'clean:build', 'copy:build', 'stylesheets', 'javascript', 'images' ]
	);

	grunt.registerTask( // Clean and Deploy
	'deploy', 
	'Deploys build', 
	[ 'build', 'clean:deploy', 'copy:deploy', 'clean:junk', 'htmlmin', 'exec:divshot']
	);

	grunt.registerTask( // Clean and Deploy
	'critical', 
	'Finds critical above fold css', 
	[ 'build', 'penthouse']
	);

	grunt.registerTask( // Grunt
	'default', 
	'Development Build', 
	[ 'build', 'connect', 'watch' ]
	);

};


