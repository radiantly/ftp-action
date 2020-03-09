import * as core from '@actions/core'
import * as github from '@actions/github'
const Filter = require('bad-words');

async function run() {
  try {
    const token = core.getInput('PERSONAL_TOKEN');
    const octokit = new github.GitHub(token);

    console.log("Profanity check commencing!");
    if (github.context.eventName === 'issues') {
      let issue = github.context.payload.issue;
      let filter = new Filter();
      let cleanTitle = filter.clean(issue.title);
      let cleanBody = filter.clean(issue.body);
      if(cleanTitle !== issue.title || cleanBody !== issue.body) {
        console.log("Profanity detected, updating issue.");
        await octokit.issues.update({
          ...github.context.repo,
          issue_number: issue.number,
          title: cleanTitle,
          body: cleanBody
        });
      } else {
        console.log("Issue is free from profanity.")
      }
    }
  } catch(error) {
    core.setFailed(error.message);
  }
}

run();
