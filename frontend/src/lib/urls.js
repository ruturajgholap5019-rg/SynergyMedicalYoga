export function getAdminConsoleUrl() {
  const configuredUrl = (import.meta.env.VITE_ADMIN_URL || '').trim();
  if (configuredUrl) return configuredUrl;

  if (import.meta.env.PROD) {
    return '';
  }

  const devPort = import.meta.env.VITE_ADMIN_DEV_PORT || '';
  if (typeof window !== 'undefined' && devPort) {
    return `${window.location.protocol}//${window.location.hostname}:${devPort}`;
  }

  return '';
}
