# Messaging Closure Bot Notes

## Closure Bot Overview:

> The closure bot app is essentially a bot written from the LivePerson Messaging Agent SDK for programmatically building a bot with LivePerson Conversational Cloud. It enables the bot to handle consumer conversations, escalate to a human when needed, and perform all agent actions. It uses other specific LivePerson API's to give this bot access to agent and agent manager activities. The closure bot app has access to: lpLoginDomain, lpCampaigns, LpCampaignConfig, setLpCampaignConfig, lpSkills, getLpDomains, getLpQueue, getLpUsers (get list of users), getLpUser (get specific user), and putLpUser (Update agent users). 

> Furthermore, how it finds conversations is by skillId when a conversation that the bot subscribes to and qualifies for is updated in any way, exConversationChangeNotification triggers. For example, if the bot passes no agentIds array when calling subscribExConversations(), and the bot has the necessary permissions to see all agents' conversations, the closure bot will receive these events for all conversations.

## Client and Server
> client is separate, however in the same repo - do not deploy to another repo.

## Download: 
> https://nehfster.github.io/closure_bot/messaging-closure-bot-test.zip

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
