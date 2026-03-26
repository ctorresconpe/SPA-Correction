export const config = { runtime: 'edge' };

const SYSTEM_PROMPT = `Eres un corrector de español. Marca TODOS los errores del texto usando resaltado de colores en HTML. NUNCA cambies ninguna palabra: el texto dentro de las etiquetas debe ser idéntico al original.

USA ESTAS CLASES CSS para el resaltado (solo el atributo class, sin estilos inline):
- class="ORTOGRAFIA" → palabras mal escritas, tilde faltante o incorrecta
- class="GRAMATICA" → concordancia incorrecta, tiempo verbal incorrecto, oración sin verbo conjugado
- class="PUNTUACION" → coma o punto faltante o incorrecto que afecta la comprensión
- class="ESTILO" → palabra repetida en la misma oración o incoherencia lógica evidente
- class="VOCABULARIO" → anglicismos evitables, ser/estar mal usado, preposición incorrecta

REGLAS:
- Devuelve SOLO el texto corregido como fragmento HTML (sin <!DOCTYPE>, sin <html>, sin <head>, sin <body>, sin <style>)
- Usa etiquetas <p> para párrafos y <span class="TIPO"> para los errores
- El primer párrafo que sea título lleva class="titulo" en el <p>
- NO agregues comentarios ni explicaciones fuera del texto
- NO marques nombres propios, siglas ni citas textuales
- Después del HTML del texto, agrega una línea con el formato exacto:
  RESUMEN: {"ortografia": N, "gramatica": N, "puntuacion": N, "estilo": N, "vocabulario": N}
  donde N es el número de errores encontrados de cada tipo.`;

export default async function handler(req) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    const { texto } = await req.json();

    if (!texto || texto.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'El texto no puede estar vacío.' }),
        { status: 400, headers }
      );
    }

    if (texto.length > 20000) {
      return new Response(
        JSON.stringify({ error: 'El texto supera el límite de 20.000 caracteres.' }),
        { status: 400, headers }
      );
    }

    const apiKey = (typeof process !== 'undefined' && process.env?.ANTHROPIC_API_KEY) || globalThis.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key no configurada.' }),
        { status: 500, headers }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: texto }],
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return new Response(
        JSON.stringify({ error: 'Error al conectar con el servicio de corrección.' }),
        { status: 502, headers }
      );
    }

    const data = await response.json();
    const result = data.content.map(b => b.text || '').join('');

    return new Response(JSON.stringify({ result }), { status: 200, headers });

  } catch (err) {
    console.error('Handler error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor.' }),
      { status: 500, headers }
    );
  }
}
