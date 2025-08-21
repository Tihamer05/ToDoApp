
// api/proxy.js

export default async function handler(request, response) {
  // Engedélyezzük csak a POST kéréseket
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const apiKey = process.env.MY_API_KEY;
    // A helyes API URL, a kulcsot a környezeti változóból fűzzük hozzá
    const externalApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    if (!apiKey) {
      return response.status(500).json({ message: 'API key is not configured on the server.' });
    }

    // A Google API nem vár 'Authorization' headert, ha a kulcs az URL-ben van.
    const apiResponse = await fetch(externalApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // A frontend által küldött request body-t változatlanul továbbítjuk
      body: JSON.stringify(request.body),
    });

    const data = await apiResponse.json();

    if (!apiResponse.ok) {
        // Ha a külső API hibát ad, azt adjuk vissza
        return response.status(apiResponse.status).json(data);
    }

    // Sikeres válasz esetén visszaküldjük az adatot a frontendnek
    response.status(200).json(data);
  } catch (error) {
    console.error('Error in proxy function:', error);
    response.status(500).json({ message: 'An internal server error occurred.' });
  }
}
