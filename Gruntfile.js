module.exports = function(grunt){
    grunt.initConfig({
        // pass in options to plugins, references to files
        jshint: {
            files: ['*.js', 'js/*.js'],
            options: {
                globals: {
                    jQuery: true
                },
                esversion: 6
            }
        },
        csslint: {
          strict: {
            options: {
              import: 2
            },
            src: ['css/style.css']
          },
          lax: {
            options: {
              import: false
            },
            src: ['css/style.css']
          }
      },
      cssmin: {
          target: {
              files: [{
                  expand: true,
                  src: ['css/*.css', 'css/!*.min.css'],
                  dest: '',
                  ext: '.min.css'
              }]
          }
      },
        watch: {
            files: ['<%= jshint.files %>', 'css/style.css'],
            tasks: ['jshint', 'csslint']
        }
    });
    // load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // register tasks
    grunt.registerTask('checkJS', ['jshint']);
    grunt.registerTask('checkCSS',['csslint']);
    grunt.registerTask('minifyCSS', ['cssmin']);
    grunt.registerTask('runWatch', ['watch']);
};
