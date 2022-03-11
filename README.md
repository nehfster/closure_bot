# Messaging Closure Bot Notes

## Closure Bot Overview:

> The closure bot app is essentially a bot written from the [LivePerson Messaging Agent SDK](https://developers.liveperson.com/messaging-agent-sdk-overview.html) for programmatically building a bot with LivePerson Conversational Cloud. It enables the bot to handle consumer conversations, escalate to a human when needed, and perform all agent actions. It uses other specific LivePerson API's to give this bot access to agent and agent manager activities. The closure bot app has access to: [lpLoginDomain](https://developers.liveperson.com/domain-api.html), lpCampaigns, LpCampaignConfig, setLpCampaignConfig, [lpSkills](https://developers.liveperson.com/skills-api-methods-get-all-skills.html), getLpDomains, [getLpQueue](https://developers.liveperson.com/messaging-operations-api-methods-messaging-current-queue-health.html), [getLpUsers](https://developers.liveperson.com/users-api-methods-get-all-users.html) (get list of users), [getLpUser](https://developers.liveperson.com/users-api-methods-get-user-by-id.html) (get specific user), and [putLpUser](https://developers.liveperson.com/users-api-methods-update-user.html) (Update agent users). 

> Furthermore, how it finds conversations is by skillId when a conversation that the bot subscribes to and qualifies for is updated in any way, [exConversationChangeNotification](https://developers.liveperson.com/messaging-agent-sdk-events.html#cqmexconversationchangenotification) triggers. For example, if the bot passes no agentIds array when calling [subscribExConversations()](https://developers.liveperson.com/messaging-agent-sdk-events.html#subscribeexconversations), and the bot has the necessary permissions to see all agents' conversations, the closure bot will receive these events for all conversations.

## Client and Server
> client is separate, however in the same repo - do not deploy to another repo.

## Download: 
> **Zip Archive:** https://nehfster.github.io/closure_bot/messaging-closure-bot-test.zip

> **Repo:** You can download access the [closure bot Repo here](https://github.com/nehfster/closure_bot). Follow these instructions for installing after download:

1. Prerequisites: A recent version of nodeJs and Npm installed on the machine hosting the closure bot app. I tested with nodeJs v16.11.1 and npm v8.1.0.
2. Installing: decompress the .zip archive file you downloaded into a project folder on the machine with nodeJs and npm.
3. Using your developer editor (i.e., Visual Studio Code), open the project folder
4. Readme.md: Open the readme from the root folder and follow the brief directions to configure and run the app.

## Installation and Configuration
> Just copy the example `.example.env` file and rename it to just `.env`, run...

> `npm install`

> In your account you need a bot agent user with agent manager role and a dedicated skill.

> Put your account info, bot login name, and bot user credentials in `.env`

> Take a look at the code in `app.js` and the code in `./src/events/exConversationChangeNotification.js` at approximately line 17`. 

> Change the skillId of the `if statement` to target a skill where stuck conversations exist.

> Also in `./src/events/exConversationChangeNotification.js` approximately line 24, change the skillId of the transfer bot agent to the transfer skillId. This will be the bot that will handle closing the previously stuck conversations.

> The `exConversationEvent` method is currently made to see if a conversation is on a specific skill, join as agent manager and transfer the conversation to botSkill where the botAgent assigned to transferSkill simply closes the conversations.

## Running the closure bot app
> To run in dev mode using nodemon, in command-line: `npm run dev`

> To run in prod mode, command-line: `npm run start`
