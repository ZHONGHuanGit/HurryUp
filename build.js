var exec = require('child_process').exec;

var buildProcess = exec('cocos compile -p web -m release --advanced', {});
buildProcess.on('close', function () {
    console.log('start gulp task');
    var nextProcess = exec('gulp default', {});
    nextProcess.on('close', function () {
        console.log('gulp task end');
    });
    nextProcess.stdout.setEncoding('utf-8');
    nextProcess.stdout.on('data', function (data) {
        console.log(data);
    });
    nextProcess.stderr.setEncoding('utf-8');
    nextProcess.stderr.on('data', function (data) {
        throw new Error(data);
    });
});
buildProcess.stdout.setEncoding('utf-8');
buildProcess.stdout.on('data', function (data) {
    console.log(data);
});
buildProcess.stderr.setEncoding('utf-8');
buildProcess.stderr.on('data', function (data) {
    throw new Error(data);
});