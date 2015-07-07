#!/usr/bin/env node

var issueLoader = require('issues-fs-api').issueLoader;
var handlebars = require('node-handlebars');
var argv = require('process').argv;

var hbs = handlebars.create({
  partialsDir :__dirname + "/templates",
  minimize: false
 });

issueLoader(argv[2], function(err, issues) {
  var convertedIssues = {
    statusHeadings: issues.statusHeadings,
    swimLanes: issues.swimLanes.map(function(lane) {
      return {
        title: lane.title,
        statuses: issues.statusHeadings.map(function(statusHead) {
          return {
            title: statusHead,
            issues: lane.issuesWithStatus(statusHead)
          };
        })
      };
    })
  }

  hbs.engine(__dirname + "/templates/layout.html", convertedIssues, function(err, html) {
    if (err) {
      throw err;
    }
    console.log(html);
  });
});
