# Automated Protection of a Main Branch Upon New GitHub Repository 

![Architecture Diagram](./images/architecture-github.jpg)

This repository contains a solution that automates the protection of a main branch for a new GitHub repository by exploring powerful GitHub APIs, webhook, and a simple NodeJS webservice.

## Features

- Provide a simple NodeJS webservice built with powerful GitHub APIs, GitHub Oktokit libraries, and webhook
- Automatically protect a main branch (default: master) upon creating a new repository
- Deploy under a Kubernetes platform like Red Hat Openshift to provide the easy deployment and scalability
- Create an issue and notify an user with **@TAG_NAME** mechanism
- Create a sample README.md file under **master** branch
- Automatically protect the **master** branch 

## What are in this repo

| File Name | What It Is |
| ------- | ------------ |
| app | Directory containing the actual files to run NodeJS based application |
| app/server.js | Main NodeJS file that runs the application and listen to GitHub webhook  |
| app/package.json | Install and manage the packages like  "@octokit/webhooks" and  "@octokit/core" |
| app/package-lock.json | Describes the exact tree that was generated, such that subsequent installs are able to generate identical trees, regardless of intermediate dependency updates. [See package-lock.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-lock-json) |
| docs | Directory containing the supplementary documentation files |
| docs/FAQ.md | Contains some commonly asked questions and answers |
| images | Directory that contains image files to be referenced throughout documentation |
| .gitignore | Prevents an uncessary files to be checked into the repo |
| LICENSE | MIT License |
| README.md | This file that you are reaading :) | 
| CONTRIBUTING.md | Guide on how to contribute to the repo |


## PreRequisites

Due to the security concerns and reusability, the environment variables will be used to populate the necessary values. These values are shown under [required-environment.env](./required-environment.env) and should set accordingly based on the environments you are running. In the [app/server.js](./app/server.js), these will be references as **process.env.${ENVIRONMENT_VARIABLE}**.

| Environment Variable | What It Is | Required? | Default |
| ------- | ------------ | -------- | ----- |
| PERSONAL_TOKEN | Personal access tokens (PATs) are an alternative to using passwords for authentication to GitHub. [See Personal Access Token]((https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).) | Yes | None |
| GITHUB_WEBHOOK_SECRET | Webhook secret has to be created under your organization. [See Webhook](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/securing-your-webhooks) | Yes | None |
| ORGANIZATION | New organization that hosts this application and also your new repos | Yes | None |
| TAG_NAME | GitHub User ID to notify the creation of a new repo through an issue | Yes | None |
| CONTENT_FILE | Base64 encoded content for main README.MD file. [See FAQ section](docs/FAQ.md) | No but highly recommended | "Get Started" in BASE64 Encoded |
| USER_AGENT | Defines the name of the application. [See User Agent](https://docs.github.com/en/free-pro-team@latest/rest/overview/resources-in-the-rest-api#user-agent-required) | No but recommended | "myApp v.1.2.3" |
| TIME_ZONE | Some requests that create new data, such as creating a new commit, allow you to provide time zone information when specifying or generating timestamps. Default is set to [See Time Zone](https://docs.github.com/en/free-pro-team@latest/rest/overview/resources-in-the-rest-api#timezones) | No but recommended | "America/Chicago" |
| PROTECTING_BRANCH | Branch to protect when a new repo is created | No | master |
| COMMITER_NAME | Name of a commiter | No | "Anonymous" |
| COMMITER_EMAIL | Email of a commiter | No | "Anonymous" |
| AUTHOR_NAME | Name of an author | No |  "Anonymous" |
| AUTHOR_EMAIL | Email for an author | No | "Anonymous" |


When you run this application locally, these values can be set by exporting values as environment variables. For example, in Mac, you can run the following command:

```sh
export TIME_ZONE=$(echo America/Chicago)
```

If you are deploying this application to a cloud environment, these values can be set through environment properties like **ConfigMap** or **Secret** resources in Openshift/Kubernetes.

See the file [**required-environment.env**](./required-environment.env) to check the environment variables you have to set.

## Getting Started

Depending on your environment, some steps will be different on how you configure. However, follow the step-by-step guides below jumpining into the individual setup guide as these steps should be same.


STEP 1: Login to a GitHub account, or create a new one if you don't have one already.

STEP 2: Generate a SSH private key/public key pair and setup public key in your GitHub account. 

To authenticate with GitHub, we can use **https**, but we will use **ssh** instead.


If you have not already, run the following command to generate a public key and a public key pair. Public key will be 
```sh
ssh-keygen
```

[Read the guide on FAQ section on how to add the public key to GitHub](docs/FAQ.md)

STEP 3: Create a new organization. This value will be one of the required environment variables that you will need to set as seen under [required-environment.env](./required-environment.md). Also, when you create a new repo or setup a webhook token, this will be the one that you will use.

STEP 4: Setup a GitHub token under your new organization.

Follow [this guide on how to create a personal token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token).

![Personal Token Setup](./images/personal-token.jpg)

Make sure you select everything under **repo**, everything under **admin:repo_hook**, and **delete_repo**. Make sure to copy and save it in a safe location. This token is referenced in [required-environment.env](./required-environment.env), and you need it for your app to be authenticated with GitHub.


STEP 5: Visit the [Automated GitHub Branch Protection GitHub page](https://github.com/Korean-American-IT-Association-KAITA/Automated-GitHub-Branch-Protection) and fork the repo. See the screenshot below.

STEP 6: Setup a Webhook for your organizaton

Now, follow the respective guide below for your own environment.

### Running the application on localhost

The easiest way to test the application is to run the application locally. 

* Installed [**NodeJS**](https://nodejs.org/en/) + **NPM**. [**Read the guide**](https://nodejs.org/en/download/)
* Installed [**ngrok**](https://ngrok.com/). Ngrok is a free software tool to expose our localhost to the internet. [**Read the guide**](https://ngrok.com/download)

STEP 1: Clone the repo

```sh
git clone git@github.com:Korean-American-IT-Association-KAITA/Automated-GitHub-Branch-Protection.git
```

STEP 2: CD into the directory & run the **npm install** command

```sh
# cd into the app directory
cd xxx/app
# Install NPM packages
npm install
```

Running the command above will install the NPM packages as specified in the **package.json**.

STEP 3: Fill in and replace the required environment variables

STEP 4: Launch the NodeJS instance 

```sh
npm start
```

STEP 5: Launch the [ngGrok](https://ngrok.com/) instance

```sh
ngrok http 3000
```

STEP 6: Setup the Webhook path

STEP 7: Verify with creating a new repo


### Deploying and Running on Red Hat Openshift

These steps provide how to deploy to Red Hat Openshift, which is a powerful enterprise Kubernetes platform. However, the steps should be similar 

1. Login to an Openshift cluster

```sh
oc login ${ocp cluster}
```

2. Create a new project/namespace

```sh
oc new-project ${new project}
```

3. Create a new 

Shell (Mac, Linux):

```sh
curl -fsSL https://deno.land/x/install/install.sh | sh
```

PowerShell (Windows):

```powershell
iwr https://deno.land/x/install/install.ps1 -useb | iex
```

[Homebrew](https://formulae.brew.sh/formula/deno) (Mac):

```sh
brew install deno
```

[Chocolatey](https://chocolatey.org/packages/deno) (Windows):

```powershell
choco install deno
```

Build and install from source using [Cargo](https://crates.io/crates/deno):

```sh
cargo install deno
```

See
[deno_install](https://github.com/denoland/deno_install/blob/master/README.md)
and [releases](https://github.com/denoland/deno/releases) for other options.

### Deploying and Running on Local Kubernetes Service

Coming Soon!

### Deploying and Running on Amazon Kubernetes Service

Coming Soon!

### Deploying and Running on Digital Ocean Kubernetes Service

Coming Soon!

### Deploying and Running on Microsoft Azure Kubernetes Service

Coming Soon!

### Deploying and Running on Google Cloud Platform Kubernetes Service

Coming Soon!

### Deploying and Running on Heroku Service

Coming Soon!


### Contributing

We appreciate your help!

To contribute, please read our
[guidelines](CONTRIBUTING.md).


## References

* [GitHub REST API Documentation: Configuring your server to receive payloads
](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/configuring-your-server-to-receive-payloads)

* [GitHub REST API Documentation: Getting started with the REST API
](https://docs.github.com/en/free-pro-team@latest/rest/guides/getting-started-with-the-rest-api)

* [GitHub Documentation: Creating a personal access token](https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token)

* [GitHub REST API Documentation: Issues -> Create An Issue](https://docs.github.com/en/free-pro-team@latest/rest/reference/issues#create-an-issue)

* [GitHub Webhooks Documentation: About webhooks](https://docs.github.com/en/free-pro-team@latest/developers/webhooks-and-events/about-webhooks#events)

* [GitHub Oktokit REST API Documentation: Usage](https://octokit.github.io/rest.js/v18#usage)

* [GitHub Oktokit REST API Documentation: Create an Issue](https://octokit.github.io/rest.js/v18#issues-create)

* [GitHub Issue - updateBranchProtection requires luke-cage preview #1368](https://github.com/octokit/rest.js/issues/1368)

