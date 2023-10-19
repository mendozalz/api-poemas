const https = require('https');

module.exports.generarPoemas = async (event) => {
  // Extraer el cuerpo del evento (solicitud POST)
  const requestBody = JSON.parse(event.body);

  // Definir los parámetros de la solicitud a la API de OpenAI
  const apiKey = process.env.OPENAIKEY;
  const apiEndpoint = 'api.openai.com';
  const apiPath = '/v1/engines/text-davinci-003/completions';
  const prompt = requestBody.romantico ? 'Escribe un poema romántico' : 'Escribe un poema no romántico';

  const requestData = JSON.stringify({
    prompt: prompt,
    max_tokens: 50, // Ajusta el número de tokens según tus necesidades
  });

  const options = {
    hostname: apiEndpoint,
    path: apiPath,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const response = {
          statusCode: res.statusCode,
          body: data,
        };

        resolve(response);
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(requestData);
    req.end();
  });
};
