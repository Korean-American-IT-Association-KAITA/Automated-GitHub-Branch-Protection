/**
 * Automated branch protection using GitHub API and webhook
 * @author Bryant Son
 * @since 12/23/20
 */

var http = require('http');

const { Octokit } = require("@octokit/rest");
const { Webhooks } = require("@octokit/webhooks");

const webhooks = new Webhooks({
  secret: process.env.GITHUB_WEBHOOK_SECRET,
  path: "/webhook"
});

const octokit = new Octokit({ 
  auth: process.env.PERSONAL_TOKEN,
  userAgent: process.env.USER_AGENT ? process.env.USER_AGENT : "myApp v.1.2.3",
  previews: ['jean-grey', 'symmetra'],
  timeZone: process.env.TIME_ZONE ? process.env.TIME_ZONE : "America/Chicago", 
  baseUrl: 'https://api.github.com',
});

const organization = process.env.ORGANIZATION;

webhooks.on("repository", ({ id, name, payload }) => {

  const nameRepo = payload.repository.name;

  try {

    console.log(name, "event received");

    if(!payload) {
      throw "ERROR with null payload";
    }

    if(!payload.repository) {
      throw "ERROR with null payload.repository";
    }

    console.log("PAYLOAD: " + JSON.stringify(payload));

  
    if(payload.action == "created") {

      octokit.issues.create({
        owner: organization,
        repo: nameRepo,
        title: "New Repo Creation Update",
        body: "New repo was created! Notifying @" + process.env.TAG_NAME
      }).then((response) => {
        console.log("SUCCESS IN CREATING ISSUE: " + JSON.stringify(response));
      });

      octokit.repos.createOrUpdateFileContents({
        owner: organization,
        repo: nameRepo,
        branch: process.env.PROTECTING_BRANCH ? process.env.PROTECTING_BRANCH: "master",
        path: "README.md",
        message: "Created README.md",
        content: process.env.CONTENT_FILE ? process.env.CONTENT_FILE : "R2V0IFN0YXJ0ZWQ=",
        committer: {
          name: process.env.COMMITER_NAME ? process.env.COMMITER_NAME: "Anoynmous",
          email: process.env.COMMITER_EMAIL ? process.env.COMMITER_EMAIL: "Anoynmous",
        },
        author: {
          name: process.env.AUTHOR_NAME ? process.env.AUTHOR_NAME: "Anoynmous",
          email: process.env.AUTHOR_EMAIL ? process.env.AUTHOR_EMAIL: "Anoynmous",
        }
      }).then((response) => {
        console.log("SUCCESS IN CREATING FILE: " + JSON.stringify(response));
      });
    }

    if(payload.action == "edited") {
      octokit.repos.updateBranchProtection({
          owner: organization,
          repo: nameRepo,
          branch: process.env.PROTECTING_BRANCH ? process.env.PROTECTING_BRANCH: "master",
          required_status_checks: {
            strict: true,
            contexts: [
              'contexts'
            ]
          },
          enforce_admins: true,
          required_pull_request_reviews: {
            dismissal_restrictions: {
              users: [
                'users'
              ],
              teams: [
                'teams'
              ]
            },
          dismiss_stale_reviews: true,
          require_code_owner_reviews: false,
          required_approving_review_count: 1
          },
          mediaType: {
            previews: [
              'luke-cage'
            ]
          },
          restrictions: {
            users: [
              'users'
            ],
            teams: [
              'teams'
            ]
          }
        }).then((response) => {
          console.log("SUCCESS IN UPDATING BRANCH: " + JSON.stringify(response));
        });
    }

  } catch(e) {
    console.log("ENTERING CATCH BLOCK");
    console.log(e);
  } finally {
    console.log("CLEANING UP");
  }

});

http.createServer(webhooks.middleware).listen(3000);

