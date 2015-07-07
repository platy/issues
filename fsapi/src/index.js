const path = require('path');
import {readTree} from './dirtree.js';

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

function isIssueFilename(filename) {
  return !filename.startsWith('.');
}

const DEFAULT_STATUS_NAMES = ['open', 'inprogress', 'closed'];

/** Interface with a project's issues from this class */
class ProjectIssues {
  constructor(issuesPath, callback) {
    const self = this;
    readTree(issuesPath, function(err, issuetree) {
      const swimLanes = {};
      if (err)
        callback(err);
      self._statusHeadings = [];
      issuetree.dirs.forEach(function (statusdir) {
        const {status, assignee} = parseStatusDirname(statusdir.name);
        self._statusHeadings.push(status);
        statusdir.files.filter((file) => isIssueFilename(file.name)).map((issuefile) =>
          new Issue(null, status, assignee, issuefile.name)
        ).forEach((issue) => {
          const swimLane = swimLanes[issue.swimLane] || [];
          swimLane.push(issue);
          swimLanes[issue.swimLane] = swimLane;
        })
      });
      self._statusHeadings = orderLike(self._statusHeadings, DEFAULT_STATUS_NAMES);
      self._swimLanes = Object.keys(swimLanes).sort().map((swimLaneTitle) => new SwimLane(swimLaneTitle, swimLanes[swimLaneTitle]));
      callback(null, self);
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
    this._issues = issues;
  }
  /** Title of the swim lane */
  get title() {
    return this._title;
  }
  /** Iterable of all the tasks under this swim lane with the specified status */
  issuesWithStatus(status) {
    return this._issues.filter((issue) => issue.status === status);
  }
}

const LANE_SEPERATOR_CHAR = ':';
const STATUS_SEPERATOR_CHAR = ':';

export function parseIssueFileName(fileName) {
  const bodyExtension = path.extname(fileName);
  const basename = path.basename(fileName, bodyExtension);
  if(fileName.indexOf(LANE_SEPERATOR_CHAR) >= 0) {
    const [lanename, issuename] = basename.split(/:(.+)/, 2)
    return {
      swimLaneName: lanename.trim(),
      issueName: issuename.trim(),
      bodyExtension
    }
  } else {
    return {
      swimLaneName: '',
      issueName: basename,
      bodyExtension
    };
  }
}

function parseStatusDirname(dirname) {
  const [status, assignee] = dirname.split(STATUS_SEPERATOR_CHAR);
  return {status, assignee};
}

class Issue {
  constructor(issuesPath, status, assignee, issueFileName) {
    const {swimLaneName, issueName} = parseIssueFileName(issueFileName);
    this._swimLaneName = swimLaneName;
    this._title = issueName;
    this._status = status;
    this._assignee = assignee;
  }
  get title() {
    return this._title;
  }
  get assignee() {
    return this._assignee;
  }
  get bodyHtml() {}
  get swimLane() {
    return this._swimLaneName;
  }
  get status() {
    return this._status;
  }
}

export function issueLoader(path, callback) {
  return new ProjectIssues(path, callback);
}
