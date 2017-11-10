var fs = require('fs');
var events = require('events');
var util = require('util');
var path = require('path');

// 创建 Watcher 类
var Watcher = function Watcher (watchDir, processDir) {
    this.watchDir = watchDir;
    this.processDir = processDir;
}

// 继承事件发射类
util.inherits(Watcher, events.EventEmitter);

// 监控文件变更
Watcher.prototype.watch = function () {
    var self = this;
    fs.readdir(self.watchDir, function (err, files) {
        if (err) throw err;
        files.forEach((v, i) => {
            self.emit('process', v);
        });
    })
}
// 开始监控
Watcher.prototype.start = function () {
    var self = this;
    fs.watchFile(self.watchDir, function (curr, prev) {
        //listener 有两个参数，当前的状态对象和以前的状态对象：curr, prev
        self.watch();
    });
}

// 创建、处理监控
var watchDir = path.join(__dirname, './filWatcherDir/watch'),
    processDir = path.join(__dirname, './filWatcherDir/done');
var watcher = new Watcher(watchDir, processDir);
watcher.on('process', function (file) {
    var watchFile = path.join(this.watchDir, file);
    var processFile = path.join(this.processDir, file.toLowerCase());
    fs.rename(watchFile, processFile, function (err) {
        if (err) throw err;
        console.log('a file processed');
    })
});
watcher.start();