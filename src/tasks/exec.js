import gulp from 'gulp';
import Elixir from 'laravel-elixir';

/*
 |----------------------------------------------------------------
 | Shell Commands
 |----------------------------------------------------------------
 |
 | Need to execute a shell script, as part of your compile
 | process? No problem. Elixir can help with that. Just
 | call `mix.exec('command')`, and, bam, you're set!
 |
 */

Elixir.extend('exec', (command, watcher) => {
    const task = new Elixir.Task('exec', () => {
        Elixir.Log
            .heading('Triggering Command...')
            .message(command);

        return (
            gulp.src('')
                .pipe(Elixir.Plugins.shell(command))
        );
    });

    if (watcher) {
        task.watch(watcher);
    }
});