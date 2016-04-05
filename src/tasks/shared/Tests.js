import gulp from 'gulp';
import BuildBox from '../../index';

const notify = new BuildBox.Notification();

export default function(name, src, command) {
    new BuildBox.Task(name, function(error) {
        BuildBox.Log.heading('Triggering ' + name + ': ' + command);

        return (
            gulp
            .src('')
            .pipe(BuildBox.Plugins.shell(command))
            .on('error', function(e) {
                notify.forFailedTests(e, name);

                this.emit('end');
            })
            .pipe(notify.forPassedTests(name))
        );
    })
    .watch(src)
    .watch(BuildBox.config.appPath + '/**/*.php', 'tdd')
    .watch(BuildBox.config.viewPath +'/**/*.php', 'tdd');
};
