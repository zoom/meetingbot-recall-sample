# Meeting Bot Starter Kit - Recall.ai

The Meeting Bot Starter Kit is a boilerplate Zoom Meeting assistant built using [Recall.ai](https://recall.ai), [Anthropic's Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api), and the [Zoom Apps SDK](https://developers.zoom.us/docs/zoom-apps/).

Using an automated Zoom Meeting client, it generates a transcript, requests a summary, and provides the summary back to the user in the Meeting in near real time.

Use this sample to build your own Meeting assistant by customizing the Meeting participant tile, summarization, and Zoom App.

## Demo

[![Demo: Meeting bot starter kit with Recall.ai](https://img.youtube.com/vi/7h3rLJUMtS4/0.jpg)](https://www.youtube.com/watch?v=7h3rLJUMtS4 'Demo: Meeting bot starter kit with Recall.ai')

## Features

1. Meeting audio access and transcription using [Recall.ai](https://recall.ai) and an Express server
2. Summarization using Anthropic’s Claude API
3. In-meeting app built using React and the Zoom Apps SDK

## Architecture

![Architectural diagram of the Meeting bot starter kit](/docs/images/architecture.png)

This Meeting Bot Starter Kit app joins a Zoom Meeting using a virtual meeting participant powered by [Recall.ai](https://recall.ai).

Recall receives local recording permission through a cloud-hosted Zoom client using the Zoom Meeting SDK and outputs a transcript of the meeting.

This transcript is passed to the Anthropic Claude API for summarization.

Summary responses are handled and passed back back to the user in the Zoom Meeting using a Zoom App, built using the Zoom Apps SDK.

## Prerequisites

1. [Node.js](https://nodejs.org/en/)
2. [Ngrok](https://ngrok.com/docs/getting-started)
3. [Zoom Account](https://support.zoom.us/hc/en-us/articles/207278726-Plan-Types-)
4. [Zoom App Credentials](#config:-app-credentials) (Instructions below)
    1. Client ID
    2. Client Secret
    3. Redirect URI
5. [Recall API Token](https://recall.ai)
6. [Anthropic API Token](https://anthropic.ai)

## Getting started

Open your terminal:

```bash
# Clone down this repository
git clone https://github.com/zoom/meetingbot-recall-sample

# navigate into the cloned project directory
cd meetingbot-recall-sample

# run NPM to install the app dependencies
npm install

# initialize your ngrok session
ngrok http 3001
```

### Create your Zoom App

In your web browser, navigate to the [Zoom Developer Portal](https://marketplace.zoom.us/develop/create) and register/log into your developer account.

1. Click the "Develop" button on the top right of the page and click “Build App” in the dropdown that appears.
2. Click “Create” on the "Zoom Apps" application type.
3. Name your app
4. Choose whether to list your app on the marketplace or not
5. Click "Create"

For more information, you can follow [this guide](https://dev.to/zoom/introducing-zoom-apps-33he) check out [this video series](https://www.youtube.com/playlist?list=PLKpRxBfeD1kGN-0QgQ6XtSwtxI3GQM16R) on how to create and configure these sample Zoom Apps.

### Config: App Credentials

In your terminal where you launched `ngrok`, find the `Forwarding` value and copy/paste that into the "Home URL" and "
Redirect URL for OAuth" fields.

```
Home URL:               https://xxxxx.ngrok-free.app
Redirect URL for OAuth: https://xxxxx.ngrok-free.app/auth
```

> NOTE: ngrok URLs under ngrok's Free plan are ephemeral, meaning they will only live for up to a couple hours at most, and will change every time you reinitialize the application. This will require you to update these fields every time you restart your ngrok service.

#### OAuth allow list

-   `https://example.ngrok-free.app`

#### Domain allow list

-   `appssdk.zoom.us`
-   `ngrok-free.app`
-   `ngrok.io`

### Config: Information

The following information is required to activate your application:

-   Basic Information
    -   App name
    -   Short description
    -   Long description (entering a short message here is fine for now)
-   Developer Contact Information
    -   Name
    -   Email address

> NOTE: if you intend to publish your application on the Zoom Apps Marketplace, more information will be required in this section before submitting.

### Config: App Features

Under the Zoom App SDK section, click the `+ Add APIs` button and enable the following options from their respective
sections:

#### APIs

-   shareApp
-   getRunningContext
-   getAppContext
-   getMeetingJoinUrl

### Scopes

Ensure that the following scope is selected on the Scopes tab:

-   `zoomapp:inmeeting`

### Config `.env`

When building for Development, open the `server/.env` file in your text editor and enter the following information from the App Credentials section you just
configured:

```ini
# Client ID for your Zoom App
ZM_CLIENT_ID=[app_client_id]

# Client Secret for your Zoom app
ZM_CLIENT_SECRET=[app_client_secret]

# Ngrok endpoint for your app in the Zoom Marketplace
PUBLIC_URL=https://[xxxx-xx-xx-xxx-x].ngrok-free.app

# Recall API token
RECALL_API_TOKEN=[recall_api_token]

# Anthropic API token
ANTHROPIC_API_TOKEN=[anthropic_api_token]

# The name of the bot that joins the meeting
BOT_NAME="[bot_name]"
```

> Note: If you are a [Zoom for Government (ZfG)](https://www.zoomgov.com/) customer you can use the `ZM_HOST` variable to change
> the base URL used for Zoom.

## Start the App

### Development

Run the `dev` npm script to start in development mode using a Docker container.

```shell
npm run dev
```

The `dev` script will:

1. Watch React files and build to the dist/ folder
2. Watch Server files and build to the dist/ folder
3. Start the server and webpack dev server

### Production

When running your application in production no logs are sent to the console by default and the server is not restarted
on file changes.

We use the `NODE_ENV` environment variable here to tell the application to start in prodcution mode.

```shell
# Mac/Linux
NODE_ENV=production npm start

# Windows
set NODE_ENV=production && npm start
```

## Customization: Meeting participant tile

Edit the experience of the participant joining the Meeting through configuration of the Recall API.

**Name:** Add a recognizable name for your app to give user's context on what the participant is. To change the name, you can change the `bot_name` configured at the [following location](https://github.com/zoom/meetingbot-recall-sample/blob/d6e3920878206b435ed37eb7c95c43e70b404bba/server/routes/api.js#L60).

**Profile image:** Uncomment this section

**Join meeting sound:** To play audio when the app joins a Meeting, [uncomment this section](https://github.com/zoom/meetingbot-recall-sample/blob/8d9920543d667ecb196a6fb8bd0272fcc4aa1761/server/routes/api.js#L81-L90) and replace the the text with an MP3 that you have base64 encoded.

**Chat messages:** [Uncomment this section](https://github.com/zoom/meetingbot-recall-sample/blob/8d9920543d667ecb196a6fb8bd0272fcc4aa1761/server/routes/api.js#L91-L98) to make the app send "Hello world" to everyone in the Meeting chat. Replace the text with your own message.

Reference the [Recall.ai API documentation](https://recallai.readme.io/reference/recall-overview) for additional customization options.

## Customization: LLM summarization

This demo app uses Anthropic’s Claude API to summarize meeting transcripts in near real time.

[Edit the prompt](https://github.com/zoom/meetingbot-recall-sample/blob/d6e3920878206b435ed37eb7c95c43e70b404bba/server/routes/api.js#L138-L157) sent to Claude in `/server/routes/api.js`.

Swap this out for a different LLM by [editing the API call](https://github.com/zoom/meetingbot-recall-sample/blob/d6e3920878206b435ed37eb7c95c43e70b404bba/server/routes/api.js#L194-L201) made in in the summarize route.

The user is shown [prompt options](https://github.com/zoom/meetingbot-recall-sample/blob/8d9920543d667ecb196a6fb8bd0272fcc4aa1761/frontend/components/InMeeting/Summary/Summary.js#L34C4-L34C4) in the frontend that adjust the prompt sent to handle the meeting summarization done by the Claude API.

## Customization: Zoom App

This sample is a basic example of a web app running inside the Zoom client.

Using the [Zoom Apps SDK](https://appssdk.zoom.us/classes/ZoomSdk.ZoomSdk.html), existing web apps can be modified to run in the Zoom desktop or mobile client.

In the InMeeting component, you’ll see two important components:

-   [Transcript.js](https://github.com/zoom/meetingbot-recall-sample/blob/main/frontend/components/InMeeting/Transcript/Transcript.js) handles and displays a text transcript of the conversation generated by Recall using local recording access to the Meeting’s audio.
-   [Summary.js](https://github.com/zoom/meetingbot-recall-sample/blob/main/frontend/components/InMeeting/Summary/Summary.js) handles a prompted response from the Claude API to display a summary to the user in the Meeting, providing prompt options to the user (ex: “Generate action items”) that [adjust the prompt](https://github.com/zoom/meetingbot-recall-sample/blob/8d9920543d667ecb196a6fb8bd0272fcc4aa1761/server/routes/api.js#L177) sent in the /api/summarize route.

For an additional example of a Zoom App running in a Meeting, reference the [Advanced Zoom Apps Sample](https://github.com/zoom/zoomapps-advancedsample-react) and the [Zoom Apps documentation](https://developers.zoom.us/docs/zoom-apps/).

While this is one example of an in-meeting app, the implementation shown in the Transcript and Summary component can be reused in any existing or new web app running inside the Meeting.

## Usage

To install the Zoom App, Navigate to the **Home URL** that you set in your browser and click the link to install.

After you authorize the app, Zoom will automatically open the app within the client.

### Keeping secrets secret

This application makes use of your Zoom App Client ID and Client Secret as well as a custom secret for signing session
cookies. During development, the application will read from the .env file.

In order to align with security best practices, this application does not read from the .env file in production mode.

This means you'll want to set environment variables on the hosting platform that you'
re using instead of within the .env file. This might include using a secret manager or a CI/CD pipeline.

> :warning: **Never commit your .env file to version control:** The file likely contains Zoom App Credentials and Session Secrets

### Code Style

This project uses [prettier](https://prettier.io/) and [eslint](https://eslint.org/) to enforce style and protect
against coding errors along with a pre-commit git hook(s) via [husky](https://typicode.github.io/husky/#/) to ensure
files pass checks prior to commit.

### Testing

At this time there are no e2e or unit tests.
