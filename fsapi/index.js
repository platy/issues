const fs = require('fs');
const path = require('path');

function includes(elements, search) {
  for (var e of elements) {
    if (e === search) {
      return true;
    }
  }
  return false;
}

/** Returns a list, starting with those elements which are in both the elements array and the order array, in the order or order; followed by the remaingin elements of elements. */
function orderLike(elements, order) {
  const ordered = [];
  for (var o of order) {
    if (includes(elements, o)) {
      ordered.push(o);
    }
  }
  for (var e of elements) {
    if (!includes(ordered, e)) {
      ordered.push(e);
    }
  }
  return ordered;
}

const DEFAULT_STATUS_NAMES = ['open', 'inprogress', 'closed'];

/** Interface with a project's issues from this class */
class ProjectIssues {
  constructor(issuesPath, callback) {
    const self = this;
    fs.readdir(issuesPath, function(err, statusdirs) {
      if (err)
        callback(err);
      self._statusHeadings = orderLike(statusdirs, DEFAULT_STATUS_NAMES);
      const swimLanes = {};

      function readStatusDir(statusDirNumber) {
        if(statusDirNumber == self._statusHeadings.length) {
          self._swimLanes = Object.keys(swimLanes).map((swimLaneTitle) => new SwimLane(swimLaneTitle, swimLanes[swimLaneTitle]));
          callback(null, self);
        } else {
          const statusDirPath = path.join(issuesPath, self._statusHeadings[statusDirNumber]);
          fs.readdir(statusDirPath, function(err, issues) {
            if (err)
              callback(err);
            issues.map((issueFileName) => new Issue(statusDirPath, issueFileName)).forEach((issue) => {
              const swimLane = swimLanes[issue.swimLane] || [];
              swimLane.push(issue);
              swimLanes[issue.swimLane] = swimLane;
            })
            readStatusDir(statusDirNumber + 1);
          });
        }
      }
      readStatusDir(0);
    });
  }
  /** Returns the ordered iterable of all the status headings used in this project */
  get statusHeadings() {
    return this._statusHeadings;
  }
  /** An iterable of all the swim lanes in the project */
  get swimLanes() {
    return this._swimLanes;
  }
}

class SwimLane {
  constructor(swimLaneTitle, issues) {
    this._title = swimLaneTitle;
  }
  /** Title of the swim lane */
  get title() {
    return this._title;
  }
  /** Iterable of all the tasks under this swim lane with the specified status */
  get issuesWithStatus(status) {}
}

const LANE_SEPERATOR_CHAR = ':';

function parseIssueFileName(fileName) {
  const laneSep = fileName.indexOf(LANE_SEPERATOR_CHAR);
  if(laneSep > 0) {
    return {
      swimLaneName: fileName.slice(0, laneSep).trim(),
      issueName: fileName.slice(laneSep)
    };
  } else {
    return {
      swimLaneName: '',
      issueName: fileName
    };
  }
}

class Issue {
  constructor(statusDirPath, issueFileName) {
    const {swimLaneName, issueName} = parseIssueFileName(issueFileName);
    this._swimLaneName = swimLaneName;
    this._title = issueName;
  }
  get title() {
    return this._title;
  }
  get assignee() {}
  get bodyHtml() {}
  get swimLane() {
    return this._swimLaneName;
  }
}

export function issueLoader(path, callback) {
  return new ProjectIssues(path, callback);
}
