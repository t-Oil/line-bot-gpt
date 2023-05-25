# Description

Line chat bot with GPT 3.5

## Set Config

```bash
#Key word for gpt request ex. KEYWORD:message (need : after keyword)
firebase functions:config:set line.textkeyword="xxxx"

#Line channel access token
firebase functions:config:set line.channelaccesstoken="xxxx"

#Line endpoint v2/bot
firebase functions:config:set line.channelendpoint="https://api.line.me/v2/bot"

#Openai key
firebase functions:config:set openai.token="xxxxx"

#If you need to recheck config
firebase functions:config:get

#Deploy
firebase deploy --only functions
```