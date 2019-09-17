module.exports = function(grunt) {

  grunt.initConfig({
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
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('js-hint', ['jshint']);

};
