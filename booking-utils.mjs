export function composeBooking(locale, { service = '', date = '', today }) {
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { error: 'invalid', message: '' };
    const parsed = new Date(date + 'T12:00:00Z');
    if (!Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) return { error: 'invalid', message: '' };
    if (date < today) return { error: 'past', message: '' };
  }
  let message = service ? locale.messageService.replace('{service}', service) : locale.message;
  if (date) {
    const formatted = new Intl.DateTimeFormat(locale.lang, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(date + 'T12:00:00Z'));
    message += ' ' + locale.dateMessage.replace('{date}', formatted);
  }
  return { error: '', message };
}
export function contactLinks(message, isIOS = false) {
  const text = encodeURIComponent(message);
  return { telegram: 'https://t.me/+38669868127?text=' + text, whatsapp: 'https://wa.me/38669868127?text=' + text, sms: 'sms:+38669868127' + (isIOS ? '&' : '?') + 'body=' + text };
}
