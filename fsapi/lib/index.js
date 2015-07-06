'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.issueLoader = issueLoader;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dirtreeJs = require('./dirtree.js');

var path = require('path');

function includes(elements, search) {
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = elements[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var e = _step.value;

      if (e === search) {
        return true;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return false;
}

/** Returns a list, starting with those elements which are in both the elements array and the order array, in the order or order; followed by the remaingin elements of elements. */
function orderLike(elements, order) {
  var ordered = [];
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = order[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var o = _step2.value;

      if (includes(elements, o)) {
        ordered.push(o);
      }
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }

  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = elements[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var e = _step3.value;

      if (!includes(ordered, e)) {
        ordered.push(e);
      }
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3['return']) {
        _iterator3['return']();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return ordered;
}

function isIssueFilename(filename) {
  return !filename.startsWith('.');
}

var DEFAULT_STATUS_NAMES = ['open', 'inprogress', 'closed'];

/** Interface with a project's issues from this class */

var ProjectIssues = (function () {
  function ProjectIssues(issuesPath, callback) {
    _classCallCheck(this, ProjectIssues);

    var self = this;
    (0, _dirtreeJs.readTree)(issuesPath, function (err, issuetree) {
      var swimLanes = {};
      if (err) callback(err);
      self._statusHeadings = [];
      issuetree.dirs.forEach(function (statusdir) {
        var _parseStatusDirname = parseStatusDirname(statusdir.name);

        var status = _parseStatusDirname.status;
        var assignee = _parseStatusDirname.assignee;

        self._statusHeadings.push(status);
        statusdir.files.filter(function (file) {
          return isIssueFilename(file.name);
        }).map(function (issuefile) {
          return new Issue(null, status, assignee, issuefile.name);
        }).forEach(function (issue) {
          var swimLane = swimLanes[issue.swimLane] || [];
          swimLane.push(issue);
          swimLanes[issue.swimLane] = swimLane;
        });
      });
      self._statusHeadings = orderLike(self._statusHeadings, DEFAULT_STATUS_NAMES);
      self._swimLanes = Object.keys(swimLanes).sort().map(function (swimLaneTitle) {
        return new SwimLane(swimLaneTitle, swimLanes[swimLaneTitle]);
      });
      callback(null, self);
    });
  }

  _createClass(ProjectIssues, [{
    key: 'statusHeadings',

    /** Returns the ordered iterable of all the status headings used in this project */
    get: function get() {
      return this._statusHeadings;
    }
  }, {
    key: 'swimLanes',

    /** An iterable of all the swim lanes in the project */
    get: function get() {
      return this._swimLanes;
    }
  }]);

  return ProjectIssues;
})();

var SwimLane = (function () {
  function SwimLane(swimLaneTitle, issues) {
    _classCallCheck(this, SwimLane);

    this._title = swimLaneTitle;
    this._issues = issues;
  }

  _createClass(SwimLane, [{
    key: 'issuesWithStatus',

    /** Iterable of all the tasks under this swim lane with the specified status */
    value: function issuesWithStatus(status) {
      return this._issues.filter(function (issue) {
        return issue.status === status;
      });
    }
  }, {
    key: 'title',

    /** Title of the swim lane */
    get: function get() {
      return this._title;
    }
  }]);

  return SwimLane;
})();

var LANE_SEPERATOR_CHAR = ':';
var STATUS_SEPERATOR_CHAR = ':';

function parseIssueFileName(fileName) {
  var bodyExtension = path.extname(fileName);
  var basename = path.basename(fileName, bodyExtension);
  if (fileName.indexOf(LANE_SEPERATOR_CHAR) >= 0) {
    var _fileName$split = fileName.split(LANE_SEPERATOR_CHAR);

    var _fileName$split2 = _slicedToArray(_fileName$split, 2);

    var lanename = _fileName$split2[0];
    var issuename = _fileName$split2[1];

    return {
      swimLaneName: lanename.trim(),
      issueName: issuename.trim(),
      bodyExtension: bodyExtension
    };
  } else {
    return {
      swimLaneName: '',
      issueName: basename,
      bodyExtension: bodyExtension
    };
  }
}

function parseStatusDirname(dirname) {
  var _dirname$split = dirname.split(STATUS_SEPERATOR_CHAR);

  var _dirname$split2 = _slicedToArray(_dirname$split, 2);

  var status = _dirname$split2[0];
  var assignee = _dirname$split2[1];

  return { status: status, assignee: assignee };
}

var Issue = (function () {
  function Issue(issuesPath, status, assignee, issueFileName) {
    _classCallCheck(this, Issue);

    var _parseIssueFileName = parseIssueFileName(issueFileName);

    var swimLaneName = _parseIssueFileName.swimLaneName;
    var issueName = _parseIssueFileName.issueName;

    this._swimLaneName = swimLaneName;
    this._title = issueName;
    this._status = status;
    this._assignee = assignee;
  }

  _createClass(Issue, [{
    key: 'title',
    get: function get() {
      return this._title;
    }
  }, {
    key: 'assignee',
    get: function get() {
      return this._assignee;
    }
  }, {
    key: 'bodyHtml',
    get: function get() {}
  }, {
    key: 'swimLane',
    get: function get() {
      return this._swimLaneName;
    }
  }, {
    key: 'status',
    get: function get() {
      return this._status;
    }
  }]);

  return Issue;
})();

function issueLoader(path, callback) {
  return new ProjectIssues(path, callback);
}