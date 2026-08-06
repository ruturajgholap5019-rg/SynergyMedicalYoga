function buildCashfreeReturnUrl(clientUrl) {
  const defaultUrl = 'https://synergy-medical-yoga.vercel.app/order-success?order_id={order_id}';
  if (!clientUrl) return defaultUrl;

  try {
    const url = new URL(clientUrl);
    const decodedPath = decodeURIComponent(url.pathname || '/');
    const safePath = decodedPath.replace(/\{[^}]+\}/g, '').replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
    const cleanPath = safePath.replace(/\/+(?:order-success|checkout|success|payment|pay)(?:\/)?$/i, '').replace(/\/$/, '');
    const finalPath = !cleanPath || cleanPath === '/' ? '/order-success' : `${cleanPath}/order-success`;

    url.pathname = finalPath;
    url.search = 'order_id={order_id}';
    url.hash = '';

    return decodeURIComponent(url.toString());
  } catch (err) {
    return defaultUrl;
  }
}

module.exports = {
  buildCashfreeReturnUrl,
};
