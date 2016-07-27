/*global module:false*/
module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    conf: {
      src: 'src'
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        src: ['lib/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
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
          jshintrc: '<%=conf.src%>/.jshintrc'
        },
        src: '<%=conf.src%>/sluri.js'
      }
    },
    jasmine: {
      options: {
          specs: 'tests/**/*Spec.js'
          // ,
          // styles:['<%=conf.dist%>/css/<%=pkg.name%>.css'],
          // template: require('grunt-template-jasmine-requirejs'),
          // templateOptions: {
          //     requireConfigFile: ['<%=conf.src%>/js/config.js']
          // }
      },
      spec: {
          src: '<%=conf.src%>/*.js',
          options: {
              keepRunner: true,
              outfile: 'tests.html'
          }
      }
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  //grunt.registerTask('default', ['jshint', 'nodeunit', 'concat', 'uglify']);


  grunt.registerTask('build', [
    'jshint',
    'jasmine:spec'
  ]);

  grunt.registerTask('test', [
    'jasmine:spec'
  ]);

};
