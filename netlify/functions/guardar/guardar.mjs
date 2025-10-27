import { Client } from "pg";

export default async (req) => {
  // Solo permitir peticiones POST
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no permitido" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  const client = new Client({
    connectionString: process.env.NETLIFY_DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Neon requiere SSL
  });

  try {
    const data = await req.json(); // Datos enviados desde el frontend

    await client.connect();

     // Se crea el objeto con la información a guardar | Datos obtenidos desde el navegador y con la petición
    const dataToSave = {
      ...bodyData,
      "z-headers": req.headers || {} // todos los headers de la petición dentro de z-headers
    };

    // Inserta los datos en una tabla llamada 'respuestas'
    await client.query(
      "INSERT INTO respuestas (data, fecha) VALUES ($1, NOW())",
      [JSON.stringify(dataToSave)]
    );

    return new Response(JSON.stringify({ estado: "ok" }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error al guardar:", error);
    return new Response(JSON.stringify({ estado: "error", detalle: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  } finally {
    await client.end();
  }
};


/* Docs on request and context https://docs.netlify.com/functions/build/#code-your-function-2
export default (request, context) => {
  try {
    const url = new URL(request.url)
    const subject = url.searchParams.get('name') || 'World'

    return new Response(`Hello ${subject}`)
  } catch (error) {
    return new Response(error.toString(), {
      status: 500,
    })
  }
}*/


