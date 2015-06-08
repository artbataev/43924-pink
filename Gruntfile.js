module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-combine-media-queries');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');


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

    clean: {
      gosha: [
        'gosha/img/README',
        'gosha/js/README'
      ]
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

    less: {
      style: {
        files: {
          'build/css/style.css': ['source/less/style.less']
        }
      },
      light: {
        files: {
          'source/css/style.css': ['source/less/style.less']
        }
      }
    },

    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 10']
      },
      style: {
        src: "build/css/style.css"
      },
    },

    cmq: {
      options: {
        log: false
      },
      style: {
        files: {
          'build/css/style.css': ['build/css/style.css']
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
          "build/css/style.min.css": ['build/css/style.css']
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{png, jpg, gif, svg}"]
        }]
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

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: "source",
          src: [
            "img/**",
            "js/**",
            "index.html",
            "form.html",
            "post.html",
            "blog.html"
          ],
          dest: "build"
        }]
      }
    },

    clean: {
      build: ["build"]
    },

    watch: {
      less: {
        // We watch and compile less files as normal but don't live reload here
        files: ['source/less/*', 'source/less/*/*'],
        tasks: ['less:light'],
      },
      livereload: {
        // Here we watch the files the less task will compile to
        // These files are sent to the live reload server after less compiles to them
        options: { livereload: true },
        files: ['source/css/style.css',"source/*.html",'source/js/script.js'],
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

  });

  grunt.registerTask("build", [
    "clean", 
    "copy",
    "less:style",
    "autoprefixer",
    // "cmq",
    "cssmin",
    "imagemin"
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
