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
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'css/main.css': 'scss/main.scss',
                }
            }
        },
    watch: {
        files: ['<%= jshint.files %>', 'scss/main.scss'],
        tasks: ['jshint', 'sass']
    }
});
// load plugins
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-csslint');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');

// register tasks
grunt.registerTask('checkJS', ['jshint']);
grunt.registerTask('checkCSS',['csslint']);
grunt.registerTask('minifyCSS', ['cssmin']);
grunt.registerTask('compileSASS', ['sass']);
grunt.registerTask('runWatch', ['watch']);
};
