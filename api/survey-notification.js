export default async function handler(req, res) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook secret
  const webhookSecret = process.env.WEBHOOK_SECRET;
  if (webhookSecret && req.headers['x-webhook-secret'] !== webhookSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { record } = req.body;

    if (!record) {
      return res.status(400).json({ error: 'No record in payload' });
    }

    const shopName = record.shop_name || 'Anonymous';
    const contactName = record.contact_name || 'Not provided';
    const contactEmail = record.contact_email || 'Not provided';
    const submittedAt = record.submitted_at || 'Unknown';
    const rawJson = record.raw_json || {};

    // Build a readable summary from the JSON
    const formatValue = (val) => {
      if (Array.isArray(val)) return val.join(', ');
      if (val === null || val === undefined) return '—';
      return String(val);
    };

    const summaryRows = Object.entries(rawJson)
      .map(([key, val]) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
        return `<tr><td style="padding:6px 12px 6px 0;vertical-align:top;font-weight:600;color:#5c5649;white-space:nowrap;">${label}</td><td style="padding:6px 0;color:#2d2a24;">${formatValue(val)}</td></tr>`;
      })
      .join('');

    const emailHtml = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:640px;margin:0 auto;color:#2d2a24;">
        <div style="background:#2d5a27;padding:24px 28px;border-radius:10px 10px 0 0;">
          <h1 style="margin:0;font-size:20px;color:#fff;">New Survey Response</h1>
          <p style="margin:6px 0 0;font-size:14px;color:#c8e0c5;">${shopName} — ${submittedAt}</p>
        </div>
        <div style="background:#faf9f6;padding:24px 28px;border:1px solid #e8e4db;border-top:none;border-radius:0 0 10px 10px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.5;">
            ${summaryRows}
          </table>
        </div>
        <p style="margin-top:16px;font-size:12px;color:#8a8479;text-align:center;">
          FramingStandard.org Survey Notification
        </p>
      </div>
    `;

    // Send via Resend
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'FramingStandard Survey <onboarding@resend.dev>',
        to: process.env.NOTIFICATION_EMAIL || 'framingstandard@gmail.com',
        subject: `New Survey Response: ${shopName}`,
        html: emailHtml,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.json().catch(() => ({}));
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Email send failed', detail: err });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Webhook handler error:', err);
    return res.status(500).json({ error: err.message });
  }
}
