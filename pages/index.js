/**
 * Aplicación GPTFLO - Generador de Preguntas
 *
 * Este componente representa la página principal de la aplicación web GPTFLO.
 * Permite a los usuarios ingresar un tema y generar preguntas relacionadas utilizando el modelo GPT de OpenAI.
 *
 * Dependencias:
 * - next/head: componente de Next.js para manipular el encabezado del documento HTML.
 * - react: biblioteca de React para construir interfaces de usuario.
 * - styles: módulo CSS para estilos específicos de la página.
 */


"use client"
import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

// Estado y variables de la aplicación
export default function Home() {
  const [topicInput, setTopicInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [showAbout, setShowAbout] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);


/**
   * Maneja el envío del formulario para generar preguntas.
   * Envía una solicitud POST al servidor para generar preguntas relacionadas al tema ingresado.
   *
   * @param {Event} event Evento de envío del formulario.
   */
  async function onSubmit(event) {
    event.preventDefault();
    try {
      if (showAbout) {
        return;
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
      console.error(error);
      alert(error.message);
    }
  }

  /**
   * Maneja el clic en el botón "Acerca de".
   * Muestra la sección de información "Acerca de" en lugar del formulario principal.
   */
  function handleAboutClick() {
    setShowAbout(true);
  }

  /**
   * Maneja el clic en el botón "Atrás".
   * Oculta la sección de información "Acerca de" y las respuestas generadas.
   */
  function handleBackClick() {
    setShowAbout(false);
    setShowAnswers(false);
  }

  /**
   * Copia las preguntas generadas al portapapeles del usuario.
   * Utiliza la API del portapapeles del navegador para realizar la copia.
   * Muestra una alerta con el resultado de la operación.
   */
  function copyQuestions() {
    const textToCopy = questions.join("\n");
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert("¡Preguntas copiadas al portapapeles!");
      })
      .catch((error) => {
        console.error("Error al copiar las preguntas:", error);
        alert("Error al copiar las preguntas. Por favor, inténtalo de nuevo.");
      });
  }
/* se encuentra el encabezado de la pagina
el formulario principal
las respuestas generadas
y por ultimo el pie de pagina*/
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
              <button className={styles.aboutButton} onClick={handleAboutClick}>Acerda de</button>
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
            <button onClick={copyQuestions}>Copiar</button>
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        Correo electrónico: gptflo@gmail.com
      </footer>
    </div>
  );
}
