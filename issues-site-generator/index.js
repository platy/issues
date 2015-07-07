#!/usr/bin/env node

var issueLoader = require('issues-fs-api').issueLoader;
var handlebars = require('node-handlebars');
var argv = require('process').argv;
var fs = require('fs');

var hbs = handlebars.create({
  partialsDir :__dirname + "/templates",
  minimize: false
 });

var indir = argv[2];
var outdir = argv[3];

issueLoader(indir, function(err, issues) {
  var convertedIssues = {
    statusHeadings: issues.statusHeadings,
    swimLanes: issues.swimLanes.map(function(lane) {
      return {
        title: lane.title,
        statuses: issues.statusHeadings.map(function(statusHead) {
          return {
            title: statusHead,
            issues: lane.issuesWithStatus(statusHead).sort(function(a,b) {
              return a.title > b.title;
            })
          };
        })
      };
    })
  }

  hbs.engine(__dirname + "/templates/layout.html", convertedIssues, function(err, html) {
    if (err) {
      throw err;
    }
    if (outdir) {
      fs.writeFile(outdir + '/issues.html', html, function (err) {
        if (err) throw err;
        console.log('Written board html');
        fs.symlink(__dirname + '/static', outdir + '/static', function (err) {
          if (err && !err.code == 'EEXIST') throw err;
          if (err && err.code == 'EEXIST')
            console.log("static already exists, skipping");
          else
            console.log('Linked static files');
        })
      });
    } else {
      console.log(html);
    }
  });
});
