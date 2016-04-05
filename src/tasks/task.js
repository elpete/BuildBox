import gulp from 'gulp';
import BuildBox from 'BuildBox';

/*
 |----------------------------------------------------------------
 | Custom Gulp Tasks
 |----------------------------------------------------------------
 |
 | Sometimes, you'll want to hook your custom Gulp tasks into
 | BuildBox. Simple! Simply call BuildBox's task() method, and
 | provide the name of your task, and a regex to watch.
 |
 */

BuildBox.extend('task', function(name, watcher) {
    const task = new BuildBox.Task('task', () => gulp.start(name));

    if (watcher) {
        task.watch(watcher);
    }
});
