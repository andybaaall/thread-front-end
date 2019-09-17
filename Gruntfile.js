module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('js-hint', ['jshint']);

module.exports = function(grunt){
  grunt.initConfig({
    csslint: {
      strict: {
        options: {
          import: 2
        },
        src: ['css/*.css']
      },
      lax: {
        options: {
          import: false
        },
        src: ['css/*.css']
      }
    },
// Sophie working above section


    jshint: {
      files: ['Gruntfile.js', 'js/script.js'],
      options: {
        globals: {
          jQuery: true
        },
        curly: true,
        eqeqeq: true,
        esversion: 6
      }
    }
//Andy working above section




//Matt working above section
  });
grunt.loadNpmTasks('grunt-contrib-csslint');
// Sophie working above section

grunt.loadNpmTasks('grunt-contrib-jshint');
//Andy working above section


//Matt working above section

grunt.registerTask('csslint',['csslint']);
// Sophie working above section

grunt.registerTask('jshint',['jshint']);
//Andy working above section


//Matt working above section
};
