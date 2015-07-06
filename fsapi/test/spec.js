import {issueLoader} from '../src/index.js'
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
    issues.swimLanes.map((lane) => lane.title).should.containDeepOrdered(['', 'swimlane1', 'swimlane2'])
  });

  it("loads issues into the correct status in swimlanes", function() {
    issues.swimLanes[0].title.should.equal('');
    issues.swimLanes[0].issuesWithStatus('inprogress')[0].title.should.equal('task3');
    issues.swimLanes[1].title.should.equal('swimlane1');
    issues.swimLanes[1].issuesWithStatus('closed')[0].title.should.equal('task1');
    issues.swimLanes[2].title.should.equal('swimlane2');
    issues.swimLanes[2].issuesWithStatus('open')[0].title.should.equal('task2');
  });

  it("parses the assignee from the status dir", function() {
    issues.swimLanes[0].issuesWithStatus('inprogress')[0].assignee.should.equal('platy');
  });
})
