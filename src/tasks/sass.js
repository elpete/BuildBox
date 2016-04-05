import compile from './shared/Css';
import BuildBox from 'BuildBox';

const config = BuildBox.config;

/*
 |----------------------------------------------------------------
 | Sass Compilation Task
 |----------------------------------------------------------------
 |
 | This task will compile your Sass, including minification and
 | and auto-prefixing. Sass is one of the CSS pre-precessors
 | supported by BuildBox, along with the Less CSS processor.
 |
 */

const gulpTask = function(src, output, options) {
    const paths = prepGulpPaths(src, output);

    new BuildBox.Task('sass', function() {
        return compile({
            name: 'Sass',
            compiler: require('gulp-sass'),
            src: paths.src,
            output: paths.output,
            task: this,
            pluginOptions: options || config.css.sass.pluginOptions
        });
    })
    .watch(paths.src.baseDir + '/**/*.+(sass|scss)')
    .ignore(paths.output.path);
};


BuildBox.extend('sass', function() {
    gulpTask.apply(this, arguments);
});


// Deprecated. Only for backward compatibility.
BuildBox.extend('rubySass', function() {
    gulpTask.apply(this, arguments);
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
        .src(src, config.get('assets.css.sass.folder'))
        .output(output || config.get('public.css.outputFolder'), 'app.css');
};
