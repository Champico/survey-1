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
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Neon requiere SSL
  });

  try {
    const data = await req.json(); // Datos enviados desde el frontend

    await client.connect();

    // Inserta los datos en una tabla llamada 'respuestas'
    await client.query(
      "INSERT INTO respuestas (data, fecha) VALUES ($1, NOW())",
      [JSON.stringify(data)]
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
