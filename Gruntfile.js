module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-csscomb');

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-githooks');
  grunt.loadNpmTasks('grunt-lintspaces');

  grunt.loadNpmTasks('grunt-notify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-svgstore');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    less: {
      style: {
        files: {
          'css/style.css': ['less/style.less']
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 10']
      },
      style: {
        src: "css/style.css"
      },
    },

    cmq: {
      options: {
        log: false
      },
      style: {
        files: {
          'css/style.css': ['css/style.css']
        }
      },
    },

    cssmin: {
      style: {
        options: {
          keepSpecialComments: 0,
          report: "gzip"
        },
        files: {
          "css/style.min.css": ['css/style.css']
        }
      }
    },

    sass: {
      style: {
        files: {
          'css/style.css': 'sass/style.scss'
        }
      }
    },

    lintspaces: {
      test: {
        src: [
          '*.html',
          'js/*.js',
          'less/*.less',
          'sass/*.sass'
        ],
        options: {
          editorconfig: '.editorconfig'
        }
      }
    },

    githooks: {
      test: {
        'pre-commit': 'lintspaces:test',
      }
    },

    copy: {
      gosha: {
        files: [{
          expand: true,
          src: [
            '*.html',
            'css/**',
            'img/**',
            'js/**'
          ],
          dest: 'gosha',
        }]
      }
    },

    watch: {
      less: {
        // We watch and compile less files as normal but don't live reload here
        files: ['less/*', 'less/*/*'],
        tasks: ['less', 'autoprefixer'],
      },
      livereload: {
        // Here we watch the files the less task will compile to
        // These files are sent to the live reload server after less compiles to them
        options: { livereload: true },
        files: ['css/style.css',"*.html",'js/script.js'],
      },
    },

    svgstore: {
      options: {
        prefix : 'icon-'
      },
      default : {
        files: {
          'img/sprite.svg': ['img/sprite/*.svg'],
          'img/s-logo-top.svg': ['img/sprite-logo-top/*.svg'],
          'img/s-logo-bottom.svg': ['img/sprite-logo-bottom/*.svg']
        },
      },
    },

    clean: {
      gosha: [
        'gosha/img/README',
        'gosha/js/README'
      ]
    }
  });

  grunt.registerTask("build", [
    "less",
    "autoprefixer",
    "cmq",
    "cssmin"
  ]);

  grunt.registerTask('test', ['lintspaces:test']);

  if (grunt.file.exists(__dirname, 'less', 'style.less')) {
    grunt.registerTask('gosha', ['less:style', 'copy:gosha', 'clean:gosha']);
  } else if (grunt.file.exists(__dirname, 'sass', 'style.scss')) {
    grunt.registerTask('gosha', ['sass:style', 'copy:gosha', 'clean:gosha']);
  } else {
    grunt.registerTask('gosha', ['copy:gosha', 'clean:gosha']);
  }
};
