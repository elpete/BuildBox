import gulp from 'gulp';
import _ from 'underscore';
import gutils from 'gulp-util';

let Elixir;

class Task {
    /**
     * Create a new Task instance.
     *
     * @param {string} name
     * @param {string} description
     */
    constructor(name, description) {
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
    describe(definition) {
        this.definition = definition;

        return this.register();
    }

    /**
     * Push a new task to the main collection.
     *
     * @returns {Task}
     */
    register() {
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
    watch(regex, category) {
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
    hasWatchers() {
        return this.watchers.length > 0;
    }

    /**
     * Ignore the given URL from being watched.
     *
     * @param   {string} path
     * @returns {Task}
     */
    ignore(path) {
        this.watchers.push((`!./${path}`).replace('././', './'));

        return this;
    }

    /**
     * Run the current task.
     *
     * @returns {*}
     */
    run() {
        this.isComplete = true;

        return this.definition();
    }

    /**
     * Log the task's process to the console.
     *
     * @param {object}      src
     * @param {object|null} output
     */
    log(src, output) {
        const task = this.name.substr(0,1).toUpperCase() + this.name.substr(1);

        Elixir.Log
            .heading(`Fetching ${task} Source Files...`)
            .files(src.path ? src.path : src, true);

        if (output) {
            Elixir.Log
                .heading('Saving To...')
                .files(output.path ? output.path : output);
        }
    }

    /**
     * Convert the task to a Gulp task.
     */
    toGulp() {
        const name = this.name;

        // If we've already created a Gulp task,
        // we can exit early. Nothing to do.
        if (_.has(gulp.tasks, name)) {
            return;
        }

        gulp.task(name, () => {
            if (shouldRunAllTasksWithName(name)) {
                return Elixir.tasks.byName(name)
                    .forEach(task => {
                        task.run();
                    });
            }

            // Otherwise, we can run the current task.
            return Elixir.tasks.findIncompleteByName(name)[0].run();
        });
    }
}

/**
 * Fetch the task(s) with the given name.
 *
 * @deprecated
 * @param  {string} name
 * @return {Task}
 */
Task.find = (name) => Elixir.tasks.byName(name)[0];

/**
 * See if we should run all mixins for the given task name.
 *
 * @param  {string} name
 * @return {boolean}
 */
var shouldRunAllTasksWithName = (name) => {
    return _.intersection(gutils.env._, [name, 'watch', 'tdd']).length;
}

export default elixir => {
    // Make Elixir available throughout this file.
    Elixir = elixir;

    return Task;
};