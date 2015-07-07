The page needs to be built and stored to the gh-pages branch.
- Use gh-pages npm module to copy the issues.html to the gh-pages branch
- set up a commit hook or something to do it

## Comments
- not sure about the commit hook at the moment, what do we do if the dependencies aren't installed? fail the commit? Perhaps it's better to have this done externally by CI. 
