/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    conf: {
      dist: 'dist'
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= pkg.license %> */\n',
    // Task configuration.
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'sluri.js',
        dest: '<%=conf.dist%>/sluri.min.js'
      }
    },
    jshint: {
      gruntfile: {
       options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'sluri.js'
      }
    },
    jasmine: {
      options: {
          helpers: 'tests/helpers/**/*.js',
          specs: 'tests/specs/**/*Spec.js'
          // ,
          // styles:['<%=conf.dist%>/css/<%=pkg.name%>.css'],
          // template: require('grunt-template-jasmine-requirejs'),
          // templateOptions: {
          //     requireConfigFile: ['<%=conf.src%>/js/config.js']
          // }
      },
      spec: {
          src: 'sluri.js',
          options: {
              keepRunner: true,
              outfile: 'tests.html'
          }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  grunt.registerTask('build', [
    'jshint',
    'jasmine:spec',
    'uglify:dist'
  ]);

  grunt.registerTask('test', [
    'jasmine:spec'
  ]);

};
