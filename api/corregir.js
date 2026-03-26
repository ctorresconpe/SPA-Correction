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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { texto } = req.body;
    if (!texto || texto.trim().length === 0) {
      return res.status(400).json({ error: 'El texto no puede estar vacío.' });
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'API key no configurada.' });

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
      return res.status(502).json({ error: 'Error al conectar con el servicio de corrección.' });
    }

    const data = await response.json();
    const result = data.content.map(b => b.text || '').join('');
    return res.status(200).json({ result });

  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: err.message });
  }
};
