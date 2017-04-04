module.exports = function(grunt) {
grunt.initConfig({
    jshint: {
        node: {
            files: {
                src: [
                    'gruntfile.js',
                    'application/**/*.js',
                    'app.js'
                ]
            },
            options: {
                jshintrc: '.jshintrc'
            }
        },
        browser: {
            files: {
                src: [
                    'src/static/**/*.js',
                    '!src/static/config/*.js',
                    '!src/static/.bin/**/*.js',
                    '!src/static/js/vendor/**/*.js'
                ]
            },
            options: {
                jshintrc: '.jshintrc-browser'
            }
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-jshint');

};
