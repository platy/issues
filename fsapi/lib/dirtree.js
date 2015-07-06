'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.readTree = readTree;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var fs = require('fs');
var path = require('path');

var Directory = function Directory(basepath, children) {
  _classCallCheck(this, Directory);

  this.name = path.basename(basepath);
  this.path = basepath;
  this.dirs = children.filter(function (child) {
    return child instanceof Directory;
  });
  this.files = children.filter(function (child) {
    return !(child instanceof Directory);
  });
};

var File = function File(basepath) {
  _classCallCheck(this, File);

  this.name = path.basename(basepath);
  this.path = basepath;
};

/** Recursively reads the directory tree, producing Directory objects {name, path, dirs, files} and File objects {name, path} */

function readTree(basepath, callback) {
  fs.stat(basepath, function (err, stat) {
    if (err) return callback(err);
    if (stat && stat.isDirectory()) {
      fs.readdir(basepath, function (err, list) {
        // read the files
        if (err) return callback(err);
        var pending = list.length;
        if (!pending) return callback(null, new Directory(basepath, []));
        var files = [];
        list.forEach(function (file) {
          readTree(path.join(basepath, file), function (err, res) {
            if (err) return callback(err);
            files.push(res);
            if (! --pending) callback(null, new Directory(basepath, files));
          });
        });
      });
    } else {
      // is a file
      callback(null, new File(basepath));
    }
  });
}