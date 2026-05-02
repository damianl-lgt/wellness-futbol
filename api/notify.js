const webpush = require('web-push');

webpush.setVapidDetails(
  process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

module.exports = async (req, res) => {
  if (req.query.token !== process.env.NOTIFY_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const shift = req.query.shift;
  const turno = shift === 'morning' ? 'Mañana' : 'Tarde';
  const appsScriptUrl = process.env.APPS_SCRIPT_URL;
  if (!appsScriptUrl) return res.status(500).json({ error: 'APPS_SCRIPT_URL not set' });

  try {
    const pendientesRes = await fetch(`${appsScriptUrl}?payload=${encodeURIComponent(JSON.stringify({ action: 'obtenerPendientes', turno }))}`);
    const { jugadores } = await pendientesRes.json();

    if (!jugadores || jugadores.length === 0) {
      return res.json({ sent: 0, message: 'Todos respondieron' });
    }

    const subsRes = await fetch(`${appsScriptUrl}?payload=${encodeURIComponent(JSON.stringify({ action: 'obtenerSuscripciones', nombres: jugadores.map(j => j.nombre) }))}`);
    const { suscripciones } = await subsRes.json();

    const hora = turno === 'Mañana' ? 'mañana' : 'tarde';
    const payload = JSON.stringify({
      title: '⚽ Wellness Pre-Entrenamiento',
      body: `Recordatorio de ${hora}: completá tu encuesta de bienestar antes del entrenamiento 💪`,
    });

    let enviados = 0;
    const errores = [];
    for (const sub of suscripciones) {
      try {
        await webpush.sendNotification(JSON.parse(sub.subscription_json), payload);
        enviados++;
      } catch (e) {
        errores.push({ nombre: sub.nombre, error: e.message });
      }
    }
    return res.json({ sent: enviados, errors: errores });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
