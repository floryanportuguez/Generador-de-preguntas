# OpenAI API Generador-Preguntas - Node.js example app

Esto es un ejemplo de una app generadora de preguntas. Siga las instrucciones a continuación para configurarlo.

![Imagen de como se ve la app](/mi-generador/public/Img.png)


## Setup

1. Si no tiene instalado Node.js, instalelo desde aqui (https://nodejs.org/en/) (se requiere la versión de Node.js >= 14.6.0)

2. Clonar este repositorio

3. Navegar al directorio del proyecto

   ```bash
   $ cd openai-quickstart-node
   ```

4. Instalar los requisitos

   ```bash
   $ npm install
   ```

5. Haga una copia del archivo de variables de entorno de ejemplo

 En sistemas Linux:
   ```bash
   $ cp .env.example .env
   ```
   En windows:
   ```powershell
   $ copy .env.example .env
   ```

6. Agregue su [API key](https://platform.openai.com/account/api-keys) al .env archivo recién creado

7. Ejecute la aplicación

   ```bash
   $ npm run dev
   ```

¡Ahora debería poder acceder a la aplicación en http://localhost:3000 ! 

# Generador de Preguntas con GPT-3

Este proyecto se basa en utilizar la API GPT de OpenAI. Para crear un generador de preguntas utilizando GPT-3. Sigue los pasos anteriores para configurar el proyecto y ejecutar la aplicación.

Una vez que la aplicación esté en funcionamiento, podrás ingresar un tema en el cuadro de texto y hacer clic en "Generar preguntas" para obtener una lista de preguntas generadas por GPT-3 relacionadas con ese tema.

¡Diviértete explorando el generador de preguntas con GPT-3!