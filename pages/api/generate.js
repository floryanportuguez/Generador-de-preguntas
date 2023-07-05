import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "La clave API de OpenAI no está configurada, siga las instrucciones en README.md",
      }
    });
    return;
  }

  const topic = req.body.topic || '';
  if (topic.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Ingrese un tema",
      }
    });
    return;
  }

  try {
    let questions = [];
    let remaining = 5;
    let prompt = generatePrompt(topic);
    let questionNumber = 1;

    while (remaining > 0) {
      const completion = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.6,
      });
      const question = completion.data.choices[0].text.trim();

      if (question.length > 0) {
        questions.push(`${questionNumber}. ${question}`);
        remaining--;
        prompt += `\nQ${questionNumber}: ${question}\nA${questionNumber}:`;
        questionNumber++;
      }
    }

    res.status(200).json({ result: questions.join("\n") });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error con la solicitud de API de OpenAI: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'Ocurrió un error durante su solicitud.',
        }
      });
    }
  }
}

function generatePrompt(topic) {
  const capitalizedTopic =
    topic[0].toUpperCase() + topic.slice(1).toLowerCase();
  return `Generate questions about ${capitalizedTopic}.`;
}
