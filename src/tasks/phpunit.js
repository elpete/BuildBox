import BuildBox from 'BuildBox';
import runTests from './shared/Tests';

const config = BuildBox.config;

/*
 |----------------------------------------------------------------
 | PHPUnit Testing
 |----------------------------------------------------------------
 |
 | This task will trigger your entire PHPUnit test suite and it
 | will show notifications indicating the success or failure
 | of that test suite. It works great with your tdd task.
 |
 */

BuildBox.extend('phpUnit', function(src, command) {
    runTests(
        'PHPUnit',
        src || (config.testing.phpUnit.path + '/**/*Test.php'),
        command || 'vendor/bin/phpunit --verbose'
    );
});
