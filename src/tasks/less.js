import BuildBox from 'BuildBox';
import compile from './shared/Css';

/*
 |----------------------------------------------------------------
 | Less Compilation Task
 |----------------------------------------------------------------
 |
 | This task will compile your Less, including minification and
 | and auto-prefixing. Less is one of the CSS pre-processors
 | supported by BuildBox, along with the Sass CSS processor.
 |
 */

BuildBox.extend('less', function(src, output, options) {
    const paths = prepGulpPaths(src, output);

    new BuildBox.Task('less', function() {
        return compile({
            name: 'Less',
            compiler: require('gulp-less'),
            src: paths.src,
            output: paths.output,
            task: this,
            pluginOptions: options || BuildBox.config.css.less.pluginOptions
        });
    })
    .watch(paths.src.baseDir + '/**/*.less')
    .ignore(paths.output.path);
});

/**
 * Prep the Gulp src and output paths.
 *
 * @param  {string|Array} src
 * @param  {string|null}  output
 * @return {GulpPaths}
 */
const prepGulpPaths = function(src, output) {
    return new BuildBox.GulpPaths()
        .src(src, BuildBox.config.get('assets.css.less.folder'))
        .output(output || BuildBox.config.get('public.css.outputFolder'), 'app.css');
};
