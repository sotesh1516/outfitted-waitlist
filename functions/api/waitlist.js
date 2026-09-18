const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function onRequestPost({ request, env }) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();

    if (!email || email.length > 254 || !EMAIL_RE.test(email)) {
      return json({ message: 'Enter a valid email address.' }, 400);
    }

    if (!env.DB) {
      return json({ message: 'Waitlist storage is not configured yet.' }, 503);
    }

    const existing = await env.DB.prepare('SELECT id FROM waitlist WHERE email = ? LIMIT 1')
      .bind(email)
      .first();

    if (existing) {
      return json({ message: "You're already on the list—we've got you." });
    }

    await env.DB.prepare('INSERT INTO waitlist (email) VALUES (?)').bind(email).run();
    return json({ message: "You're on the list. We'll keep you posted." });
  } catch (error) {
    console.error('waitlist signup failed', error);
    return json({ message: "We couldn't save that right now. Please try again." }, 503);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}
