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
            lax: {
                options: {
                    import: false
                },
                src: ['css/style.css']
            },
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
        uglify: {
            my_target: {
              files: {
                'js/script.min.js': ['js/script.js']
              }
            }
        },
        watch: {
            files: ['js/script.js', 'css/*.css'],
            tasks: ['jshint', 'csslint']
        }
});

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify-es');
    grunt.loadNpmTasks('grunt-contrib-watch');


    // register tasks
    grunt.registerTask('checkJS', ['jshint']);
    grunt.registerTask('checkCSS',['csslint']);
    grunt.registerTask('minifyCSS', ['cssmin']);
    grunt.registerTask('uglifyJS', ['uglify']);
    grunt.registerTask('runWatch', ['watch']);

};
