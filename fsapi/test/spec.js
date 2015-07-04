import {issueLoader} from '../index.js'
const should = require('should');

describe("fsapi over the test issues", function() {
  var issues;
  before(function(done) {
    issues = issueLoader('test/testissues', done);
  });

  it("loads the status headings in order", function() {
    issues.statusHeadings.should.containDeepOrdered(['open', 'inprogress', 'closed']);
  });

  it("loads swimlanes from across status dirs", function() {
    issues.swimLanes.map((lane) => lane.title).should.containDeep(['swimlane1', 'swimlane2', ''])
  });

  it("loads issues into the correct status in swimlanes");

  it("parses the assignee from the status dir");
})
