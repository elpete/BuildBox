import fs from 'fs';
import _ from 'underscore';

/**
 * BuildBox is a wrapper around Gulp.
 *
 * @param {Function} recipe
 */
const BuildBox = function(recipe) {
    // Perform any last-minute initializations.
    init();

    // Load all of BuildBox's task definitions.
    require('require-dir')('./tasks');

    // Load the user's Gulpfile recipe.
    recipe(BuildBox.mixins);

    // And run their chosen tasks.
    BuildBox.tasks.forEach(task => task.toGulp());
};

BuildBox.mixins       = {};
BuildBox.Log          = require('./Logger').default;
BuildBox.GulpPaths    = require('./GulpPaths').default;
BuildBox.config       = require('./Config').default;
BuildBox.Plugins      = require('gulp-load-plugins')();
BuildBox.Task         = require('./Task').default(BuildBox);
BuildBox.tasks        = new (require('./TaskCollection').default)();

/**
 * Perform any last-minute initializations.
 */
const init = function () {
    if (! BuildBox.config.notifications) {
        process.env.DISABLE_NOTIFIER = true;
    }

    BuildBox.Notification = require('./Notification').default;
};

/**
 * Register a new task with BuildBox.
 *
 * @param {string}   name
 * @param {Function} callback
 */
BuildBox.extend = function(name, callback) {
    BuildBox.mixins[name] = function() {
        callback.apply(this, arguments);

        return this.mixins;
    }.bind(this);
};

/**
 * Allow for config overrides, via an buildbox.json file.
 *
 * @param {string} file
 */
BuildBox.setDefaultsFrom = function(file) {
    let overrides;

    if (fs.existsSync(file)) {
        overrides = JSON.parse(fs.readFileSync(file, 'utf8'));

        _.mixin({
            deepExtend: require('underscore-deep-extend')(_)
        });

        _.deepExtend(BuildBox.config, overrides);
    }
}('buildbox.json');

module.exports = BuildBox;
