var fs     = require('fs');
var gulp   = require('gulp');
var remove = require('rimraf');
var should = require('chai').should();
var BuildBox = require('BuildBox');


describe('Combine Task', function() {

    beforeEach(() => {
        BuildBox.tasks.empty();
    });

    it('combines a given array of files.', done => {
        BuildBox(mix => mix.combine([
            'resources/assets/js/lib1.js',
            './resources/assets/js/lib2.js'
        ], './includes/js/combined.js'));

        runGulp(() => {
            shouldExist('./includes/js/combined.js');

            fs.readFileSync('./includes/js/combined.js', { encoding: 'utf8' })
                .should.equal('var somelib;\nvar anotherlib;');

            done();
        });
    });

    it('allows for an optional base directory', done => {
        BuildBox(mix => mix.combine([
            'js/lib1.js',
            'js/lib2.js'
        ], './includes/js/combined.js', 'resources/assets'));

        runGulp(() => {
            shouldExist('./includes/js/combined.js');

            fs.readFileSync('./includes/js/combined.js', { encoding: 'utf8' })
                .should.equal('var somelib;\nvar anotherlib;');

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

        remove.sync('./includes');
    });
};
