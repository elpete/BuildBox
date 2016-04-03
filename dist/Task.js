'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _gulp = require('gulp');

var _gulp2 = _interopRequireDefault(_gulp);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _gulpUtil = require('gulp-util');

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Elixir = void 0;

var Task = function () {
    /**
     * Create a new Task instance.
     *
     * @param {string} name
     * @param {string} description
     */

    function Task(name, description) {
        _classCallCheck(this, Task);

        this.name = name;
        this.watchers = [];
        this.isComplete = false;

        if (description) {
            this.describe(description);
        }
    }

    /**
     * Register a new task definition.
     *
     * @param   {Function} definition
     * @returns {Task}
     */


    _createClass(Task, [{
        key: 'describe',
        value: function describe(definition) {
            this.definition = definition;

            return this.register();
        }

        /**
         * Push a new task to the main collection.
         *
         * @returns {Task}
         */

    }, {
        key: 'register',
        value: function register() {
            Elixir.tasks.push(this);

            return this;
        }

        /**
         * Watch a given URL for changes.
         *
         * @param   {string}      regex
         * @param   {string|null} category
         * @returns {Task}
         */

    }, {
        key: 'watch',
        value: function watch(regex, category) {
            if (regex) {
                this.watchers = this.watchers.concat(regex);
            }

            this.category = category || 'default';

            return this;
        }

        /**
         * Determine if any watchers are registered.
         *
         * @returns {boolean}
         */

    }, {
        key: 'hasWatchers',
        value: function hasWatchers() {
            return this.watchers.length > 0;
        }

        /**
         * Ignore the given URL from being watched.
         *
         * @param   {string} path
         * @returns {Task}
         */

    }, {
        key: 'ignore',
        value: function ignore(path) {
            this.watchers.push(('!./' + path).replace('././', './'));

            return this;
        }

        /**
         * Run the current task.
         *
         * @returns {*}
         */

    }, {
        key: 'run',
        value: function run() {
            this.isComplete = true;

            return this.definition();
        }

        /**
         * Log the task's process to the console.
         *
         * @param {object}      src
         * @param {object|null} output
         */

    }, {
        key: 'log',
        value: function log(src, output) {
            var task = this.name.substr(0, 1).toUpperCase() + this.name.substr(1);

            Elixir.Log.heading('Fetching ' + task + ' Source Files...').files(src.path ? src.path : src, true);

            if (output) {
                Elixir.Log.heading('Saving To...').files(output.path ? output.path : output);
            }
        }

        /**
         * Convert the task to a Gulp task.
         */

    }, {
        key: 'toGulp',
        value: function toGulp() {
            var name = this.name;

            // If we've already created a Gulp task,
            // we can exit early. Nothing to do.
            if (_underscore2.default.has(_gulp2.default.tasks, name)) {
                return;
            }

            _gulp2.default.task(name, function () {
                if (shouldRunAllTasksWithName(name)) {
                    return Elixir.tasks.byName(name).forEach(function (task) {
                        task.run();
                    });
                }

                // Otherwise, we can run the current task.
                return Elixir.tasks.findIncompleteByName(name)[0].run();
            });
        }
    }]);

    return Task;
}();

/**
 * Fetch the task(s) with the given name.
 *
 * @deprecated
 * @param  {string} name
 * @return {Task}
 */


Task.find = function (name) {
    return Elixir.tasks.byName(name)[0];
};

/**
 * See if we should run all mixins for the given task name.
 *
 * @param  {string} name
 * @return {boolean}
 */
var shouldRunAllTasksWithName = function shouldRunAllTasksWithName(name) {
    return _underscore2.default.intersection(_gulpUtil2.default.env._, [name, 'watch', 'tdd']).length;
};

exports.default = function (elixir) {
    // Make Elixir available throughout this file.
    Elixir = elixir;

    return Task;
};