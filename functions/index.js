const functions = require("firebase-functions");
const axios = require("axios");

const TEXT_KEYWORD = functions.config().line.textkeyword;
const LINE_MESSAGING_API = functions.config().line.channelendpoint;
const LINE_HEADER = {
  "Content-Type": "application/json",
  "Authorization": `Bearer  ${functions.config().line.channelaccesstoken}`,
};

const {Configuration, OpenAIApi} = require("openai");
const configuration = new Configuration({
  apiKey: functions.config().openai.token,
});
const openai = new OpenAIApi(configuration);

exports.Bot = functions
    .region("asia-southeast1")
    .https.onRequest(async (req, res) => {
      const {events} = req.body;

      for (const event of events) {
        const message = event.message.text;

        if (event.message.type !== "text" || !message.includes(TEXT_KEYWORD)) {
          return;
        }

        const question = message.split(":")[1];
        const response = await onAiRequest(question);
        const payload = {
          type: "text",
          text: response,
        };

        await replyMessage(event.replyToken, payload);
      }

      return res.end();
    });

const onAiRequest = async (message) => {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });

  return completion.data.choices[0].message.content;
};

const replyMessage = async (replyToken, payload) => {
  await axios({
    method: "post",
    url: `${LINE_MESSAGING_API}/message/reply`,
    headers: LINE_HEADER,
    data: JSON.stringify({
      replyToken: replyToken,
      messages: [payload],
    }),
  });
};
