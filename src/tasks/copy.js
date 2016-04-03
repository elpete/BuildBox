import gulp from 'gulp';
import Elixir from 'laravel-elixir';

const $ = Elixir.Plugins;

/*
 |----------------------------------------------------------------
 | Copying
 |----------------------------------------------------------------
 |
 | This task offers a simple way to copy files from one place to
 | another. No more complicated than that! You may either set
 | a single file or alternatively you can copy a full dir.
 |
 */

Elixir.extend('copy', (src, output) => {
    const paths = new Elixir.GulpPaths().src(src).output(output);

    new Elixir.Task('copy', () => {
        this.log(paths.src, paths.output);

        return (
            gulp
                .src(paths.src.path, { dot: true })
                .pipe($.if(! paths.output.isDir, $.rename(paths.output.name)))
                .pipe(gulp.dest(paths.output.baseDir))
        );
    })
    .watch(paths.src.path)
    .ignore(paths.output.path);
});
