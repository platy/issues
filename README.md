# Issues

[issue board](http://emberexperiments.co/issues/issues.html)

This project is an a attempt to specify an open and human readable distributed issue tracking database targeted at small open source projects.

## Database Features:

- Can be stored within the project repository (either within the main project branch or in an orphan branch)
- Usable without any application
- Usable offline
- Markdown issue bodies

## Issue concepts stored in DB

- Task title
- Task body
- Task status
- Swim lanes
- Task assignee

### Other things that we'll need in the db:

- Comments: probably have a format for appending them to the markdown body
- tags
- milestones

## Tools we might want:

- Web interface for non-collaborators
- Text editor plugins for collaborators
- Notifications for assigned (/watched?) issues : maybe a git hook for the first version?
- Status page generators : maybe in jekyll

## Directory structure example

Example:
```
project
├── ...
└── issues
    ├── open
    │   ├── Swimlane: Open task in a swimlane.md
    │   ├── Swimlane: Another open task in a swimlane.md
    │   ├── Open task on it's own.md
    │   └── ...
    ├── inprogress:platy
    │   └── The task I'm working on.md
    └── closed
        ├── Swimlane: Task I completed.md
        └   ...
```

## Contents of this repository

- Research and motivation of the project [RESEARCH.md](RESEARCH.md)
- Early stages [SPEC.md](SPEC.md)
- The tasks for this project [issues/](issues)
- A node library to access an issues db on the fs [fsapi/](fsapi)
- An static issue board html generator using fsapi [issues-site-generator/](issues-site-generator)
- A generated issue board hosted on github pages [issue board](http://emberexperiments.co/issues/issues.html)
