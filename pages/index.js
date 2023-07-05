import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [topicInput, setTopicInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (showAbout) {
        return; // Return early if "Acerca de" is shown
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: topicInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setQuestions(data.result.split("\n"));
      setTopicInput("");
      setShowAnswers(true);
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  function handleAboutClick() {
    setShowAbout(true);
  }

  function handleBackClick() {
    setShowAbout(false);
    setShowAnswers(false);
  }

  return (
    <div>
      <Head>
        <title>GPTFLO</title>
        <link rel="icon" href="/LogoGPT.png" />
      </Head>

      <main className={styles.main}>
        <img src="/LogoGPT.png" className={styles.iconLarge} />
        {showAbout ? (
          <div className={styles.about}>
            <h4 className={styles.aboutHeading}>Acerca de la aplicación:</h4>
            <p className={styles.aboutText}>
              GPTFLO es una aplicación de chat impulsada por IA que utiliza GPT de OpenAI para generar respuestas a los mensajes de los usuarios.
            </p>
            <p className={styles.aboutText}>
              Simplemente escriba un mensaje en el cuadro de entrada y haga clic en el botón "Generar preguntas" para recibir una respuesta de GPT.
            </p>
            <p className={styles.aboutText}>¡Explora y diviértete con GPTFLO!</p>
            <button className={styles.backButton} onClick={handleBackClick}>Atrás</button>
          </div>
        ) : (
          <div>
            <h3>Generador de Preguntas</h3>
            <form onSubmit={onSubmit}>
              <input
                type="text"
                name="topic"
                placeholder="Ingrese un tema"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
              />
              <input
                type="submit"
                value="Generar Preguntas"
                disabled={showAbout}
              />
              <button className={styles.aboutButton} onClick={handleAboutClick}>Acerca de</button>
            </form>
          </div>
        )}
        {showAnswers && (
          <div className={styles.result}>
            <h4>Respuestas generadas:</h4>
            <ul>
              {questions.map((question, index) => (
                <li key={index}>{question}</li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        Correo electrónico: gptflo@gmail.com
      </footer>
    </div>
  );
}
