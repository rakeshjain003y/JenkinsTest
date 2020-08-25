var express = require('express');
var app     = express();
var githubMiddleware = require('github-webhook-middleware')({
  secret: 'WEBHOOK'
});

const port = 3007
 
app.post('/hooks/github/', githubMiddleware, function(req, res) {
  // Only respond to github push events
  if (req.headers['x-github-event'] != 'push') return res.status(200).end();
 
  var payload = req.body
    , repo    = payload.repository.full_name
    , branch  = payload.ref.split('/').pop();
  
  var textFiles = getChangedFiles(payload.commits, /.*\.txt$/);
});

app.listen(port, () => {
   console.log("Testing")
  console.log("Example app listening at http://localhost:${port}")
})
 
 
// The Github push event returns an array of commits.
// Each commit object has an array of added, modified and deleted files.
// getChangedFiles() returns a list of all the added and modified files
// excluding any files which are subsequently removed.
function getChangedFiles(commits, matchRegex) {
  return commits
    .reduce(function(previousCommit, currentCommit) {
      return previousCommit
        .concat(currentCommit.modified)
        .concat(currentCommit.added)
        .filter(function(value) {
          return currentCommit.removed.indexOf(value) === -1;
        });
    }, [])
    .filter(function(value, i, arr) {
      return arr.indexOf(value) >= i && matchRegex.test(value);
    });
}
