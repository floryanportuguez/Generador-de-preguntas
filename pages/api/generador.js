/**
 * Este archivo contiene una función de controlador que genera preguntas sobre un tema dado utilizando la API de OpenAI.
 * Requiere la configuración de una clave de API de OpenAI para funcionar correctamente.
 */

import { Configuration, OpenAIApi } from "openai";

// Configuración de la API de OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Controlador principal para generar preguntas sobre un tema dado.
 *
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @returns {Promise} - Promesa que se resuelve con los resultados de las preguntas generadas.
 */
export default async function generateQuestions(req, res) {
  // Verificar si la clave de API de OpenAI está configurada
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "La clave API de OpenAI no está configurada, siga las instrucciones en README.md",
      }
    });
    return;
  }

  // Obtener el tema de la solicitud HTTP
  const topic = req.body.topic || '';

  // Verificar si se proporcionó un tema válido
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

    // Generar hasta 5 preguntas sobre el tema dado
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

    // Enviar las preguntas generadas como respuesta exitosa
    res.status(200).json({ result: questions.join("\n") });
  } catch(error) {
    // Manejo de errores en caso de problemas con la solicitud de API de OpenAI
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

/**
 * Genera un fragmento de texto inicial para el modelo de OpenAI basado en el tema proporcionado.
 *
 * @param {string} topic - Tema para el cual se generarán preguntas.
 * @returns {string} - El fragmento de texto inicial para generar preguntas.
 */
function generatePrompt(topic) {
  const capitalizedTopic =
    topic[0].toUpperCase() + topic.slice(1).toLowerCase();
  return `Generate questions about ${capitalizedTopic}.`;
}
