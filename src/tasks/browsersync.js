import BuildBox from 'BuildBox';

const config = BuildBox.config;
let _;
let gutils;
let browserSync;

/*
 |----------------------------------------------------------------
 | BrowserSync
 |----------------------------------------------------------------
 |
 | Browsersync makes your browser testing workflow faster by
 | synchronizing URLs, behavior, and code changes across
 | across multiple devices. And, now it's in BuildBox!
 |
 */

BuildBox.extend('browserSync', function (options) {
    loadPlugins();

    options = _.extend({
        files: [
            config.appPath + '/**/*.cfc',
            config.appPath + '/**/*.cfm',
            config.get('public.css.outputFolder') + '/**/*.css',
            config.get('public.js.outputFolder') + '/**/*.js',
            config.get('public.versioning.buildFolder') + '/rev-manifest.json'
        ],
        watchOptions: {
            usePolling: true
        },
        snippetOptions: {
            rule: {
                match: /(<\/body>|<\/pre>)/i,
                fn: function (snippet, match) {
                    return snippet + match;
                }
            }
        }
    }, config.browserSync, options);

    // Browsersync will only run during `gulp watch`.
    if (gutils.env._.indexOf('watch') > -1) {
        browserSync.init(options);
    }

    new BuildBox.Task('browserSync', function () {}).watch();
});

/**
 * Load the required Gulp plugins on demand.
 */
const loadPlugins = function () {
    _ = require('underscore');
    gutils = require('gulp-util');
    browserSync = require('browser-sync').create();
};
