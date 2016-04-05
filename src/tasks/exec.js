import gulp from 'gulp';
import BuildBox from 'BuildBox';

/*
 |----------------------------------------------------------------
 | Shell Commands
 |----------------------------------------------------------------
 |
 | Need to execute a shell script, as part of your compile
 | process? No problem. BuildBox can help with that. Just
 | call `mix.exec('command')`, and, bam, you're set!
 |
 */

BuildBox.extend('exec', function(command, watcher) {
    const task = new BuildBox.Task('exec', function() {
        BuildBox.Log
            .heading('Triggering Command...')
            .message(command);

        return (
            gulp
            .src('')
            .pipe(BuildBox.Plugins.shell(command))
        );
    });

    if (watcher) {
        task.watch(watcher);
    }
});
