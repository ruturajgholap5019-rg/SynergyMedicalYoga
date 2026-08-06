function buildCashfreeReturnUrl(clientUrl) {
  if (!clientUrl) return 'https://synergy-medical-yoga.vercel.app/order-success';

  try {
    const url = new URL(clientUrl);
    const safePath = (url.pathname || '/').replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
    const cleanPath = safePath.replace(/\/+(?:order-success|checkout|success|payment|pay)(?:\/)?$/i, '');
    const finalPath = cleanPath === '/' ? '/order-success' : `${cleanPath}/order-success`;

    url.pathname = finalPath;
    url.search = '';
    url.hash = '';

    return url.toString();
  } catch (err) {
    return String(clientUrl)
      .replace(/\{[^}]+\}/g, '')
      .replace(/[?&]order_id=[^&]*/i, '')
      .replace(/[?&]session_id=[^&]*/i, '')
      .replace(/[?&]+$/g, '')
      .replace(/\/+(?:order-success|checkout|success|payment|pay)(?:\/)?$/i, '')
      .replace(/\/$/, '')
      .replace(/\/order-success\/?$/i, '/order-success');
  }
}

module.exports = {
  buildCashfreeReturnUrl,
};
