# Paladin Brotherhood discord bot

### Available commands
###### /add_user
Provided to discord members to declare themself to the Brotherhood System

Inputs: 
- Wallet (optional): free text to add their 0x (not compatible with ENS)
- Twitter: free text to provide the direct twitter URL to their profile

###### /add_tweet
Must be an admin command.
Used to track new tweet.

Inputs: 
- URL: free text. Full URL to the tweet

###### /remove_all_tweets
Must be an admin command.
Used to delete all followed tweets (no impact on already earned Honors)

Inputs: 
- sure: free text. Must be yes to launch the delete

###### /refresh_twitter
Must be an admin command.
Used to Refresh Twitter interactions to handle Honors users actions (Like, RT) and update the HONORS.

###### /tweets_export_data
Must be an admin command.
Returns Excel file with all tweets data

###### /add_honors_campaign
Must be an admin command.
Used to create new Honors campaigns for Honors users (Zapper, meme, fan arts, ...).

Inputs: 
- Name: free text. Name of the campaign (meme, fan art, lore). Must be unique
- Description: free text. Description of the honors campaign
- Honors: free text. Honors amount for each new actions in the campaign

###### /get_honors_campaigns
Must be an admin command.
Returns all Honors campaigns.

###### /close_honors_campaign
Must be an admin command.
Used to close selected honors campaign.

Inputs: 
- Campaign: dropdown list to select a campaign to stop

###### /reopen_honors_campaign
Must be an admin command.
Used to reopen selected honors campaign.

Inputs: 
- Campaign: dropdown list to select a campaign to reopen

###### /honors_total
Must be an admin command.
Returns Excel file with all honors data

###### /add_honors
Must be an admin command.
Used to add new Honors to selected  Honors user for selected Honors campaign.

Inputs: 
- User: dropdown list to select a user
- Campaign: dropdown list to select a campaign
- Comment (optional): free text to add a comment

###### /honors
Returns the honors for the current user

###### /ping
Pong? <3