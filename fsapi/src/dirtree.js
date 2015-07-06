const fs = require('fs');
const path = require('path');

class Directory {
  constructor(basepath, children) {
    this.name = path.basename(basepath);
    this.path = basepath;
    this.dirs = children.filter((child) => child instanceof Directory);
    this.files = children.filter((child) => !(child instanceof Directory));
  }
}

class File {
  constructor(basepath) {
    this.name = path.basename(basepath);
    this.path = basepath;
  }
}

/** Recursively reads the directory tree, producing Directory objects {name, path, dirs, files} and File objects {name, path} */
export function readTree(basepath, callback) {
  fs.stat(basepath, function(err, stat) {
    if (err) return callback(err);
    if (stat && stat.isDirectory()) {
      fs.readdir(basepath, function(err, list) { // read the files
        if (err) return callback(err);
        var pending = list.length;
        if (!pending) return callback(null, new Directory(basepath, []));
        var files = [];
        list.forEach(function(file) {
          readTree(path.join(basepath, file), function(err, res) {
            if (err) return callback(err);
            files.push(res);
            if (!--pending)
              callback(null, new Directory(basepath, files));
          });
        });
      });
    } else { // is a file
      callback(null, new File(basepath));
    }
  });
}
