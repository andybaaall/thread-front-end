module.exports = function(grunt){
    grunt.initConfig({
        // pass in options to plugins, references to files
        jshint: {
              files: ['*.js'],
              options: {
                globals: {
                  jQuery: true
                },
                esversion: 6
              }
            },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint']
        }
    });
    // load plugins
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // register tasks
    grunt.registerTask('checkJS', ['jshint']);
    grunt.registerTask('runWatch', ['watch']);
};



// module.exports = function(grunt){
//
//   // CONFIGS -------------------------------------------------------------------
//   grunt.initConfig({
//     csslint: {
//       strict: {
//         options: {
//           import: 2
//         },
//         src: ['css/*.css']
//       },
//       lax: {
//         options: {
//           import: false
//         },
//         src: ['css/*.css']
//       }
//     },
//     // Sophie working above section
//
//     jshint: {
//       files: ['Gruntfile.js', 'js/script.js'],
//       options: {
//         globals: {
//           jQuery: true
//         },
//         curly: true,
//         eqeqeq: true,
//         esversion: 6
//       }
//     },
//     // Andy working above section
//
//     watch: {
//       css: {
//         files: ['css/*.css'],
//         tasks: ['csslint']
//       },
//       js: {
//         files: ['js/*.js', '!js/*.min.js'],
//         tasks: ['jshint']
//       }
//     },
//     //Matt working above section
//
//     // John working above this section
//   });
// // CONFIGS ^^^^^^  -------------------------------------------------------------
//
// // LOAD TASKS ------------------------------------------------------------------
//   grunt.initConfig({
//     // csslint: {
//     //   strict: {
//     //     options: {
//     //       import: 2
//     //     },
//     //     src: ['css/*.css']
//     //   },
//     //   lax: {
//     //     options: {
//     //       import: false
//     //     },
//     //     src: ['css/*.css']
//     //   }
//     // },
//     // Sophie working above section
//
//
//     jshint: {
//         files: ['*.js'],
//         options: {
//           globals: {
//             jQuery: true
//           },
//           esversion: 6
//         }
//       }
// //Andy working above section
//   //   watch: {
//   //     css: {
//   //       files: ['css/*.css'],
//   //       tasks: ['csslint']
//   //     },
//   //     js: {
//   //       files: ['*.js, js/*.js'],
//   //       tasks: ['jshint']
//   //     }
//   //   }
//   // });
// //Matt working above section
//
// // grunt.loadNpmTasks('grunt-contrib-csslint');
// // Sophie working above section
//
// grunt.loadNpmTasks('grunt-contrib-jshint');
// //Andy working above section
//
// // grunt.loadNpmTasks('grunt-contrib-watch');
// //Matt working above section
//
// // LOAD TASKS ^^^^^^  ----------------------------------------------------------
//
// // REGISTER TASKS ^^^^^^  ------------------------------------------------------
//
// // grunt.registerTask('csslint',['csslint']);
// // Sophie working above section
//
// grunt.registerTask('jshint',['jshint']);
// //Andy working above section
//
// // grunt.registerTask('runWatch', ['watch']);
// //Matt working above section
//
// // REGISTER TASKS  ^^^^^^  ------------------------------------------------------
//
// };
