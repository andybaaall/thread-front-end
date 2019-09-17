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



//Andy working above section




//Matt working above section
  });
grunt.loadNpmTasks('grunt-contrib-csslint');
// Sophie working above section


//Andy working above section


//Matt working above section

grunt.registerTask('csslint',['csslint']);
// Sophie working above section


//Andy working above section


//Matt working above section
};
