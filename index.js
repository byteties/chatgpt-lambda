const { TwitterApi } = require("twitter-api-v2");
const OpenAI = require("openai");
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});
exports.handler = async (event) => {
  const prompt = event.prompt || "Can you give me a random good positive story in the world for today?";
  try {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4o-mini",
    });
    const message = chatCompletion.choices[0].message;
    try {
      const tweet = await client.v2.tweet(message.content);
      console.log("response", JSON.stringify(tweet, null, 2));
    } catch (error) {
      console.log("tweet was failed");
      console.error(error);
    }
    return {
      statusCode: 200,
      body: JSON.stringify({ message }),
    };
  } catch (error) {
    console.error('Error calling OpenAI API:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'There was an error processing your request.' }),
    };
  }
};