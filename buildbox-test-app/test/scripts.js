var fs     = require('fs');
var gulp   = require('gulp');
var remove = require('rimraf');
var BuildBox = require('BuildBox');

describe('Scripts Task', function() {

    beforeEach(() => {
        BuildBox.tasks.empty();
    });

    it('merges scripts together', function(done) {
        BuildBox(mix => mix.scripts(['lib1.js', 'lib2.js']));

        runGulp(() => {
            shouldExist('public/js/all.js');

            done();
        });
    });

    it('merges to any file the user wishes', function(done) {
        BuildBox(mix => mix.scripts(['lib1.js', 'lib2.js'], './public/js/merged.js'));

        runGulp(() => {
            shouldExist('public/js/merged.js');

            done();
        });
    });

    it('applies a custom base directory', function(done) {
        BuildBox(mix => {
            // We'll copy files over to a custom directory to test this.
            mix.copy('./resources/assets/js', './resources/assets/scripts');

            mix.scripts(['lib1.js', 'lib2.js'], null, './resources/assets/scripts');
        });

        runGulp(() => {
            shouldExist('public/js/all.js');

            done();
        });
    });

});


var shouldExist = (file) => {
    return fs.existsSync(file).should.be.true;
};


var runGulp = assertions => {
    gulp.start('default', () => {
        assertions();

        remove.sync('./public/js');
        remove.sync('./resources/assets/scripts');
    });
};