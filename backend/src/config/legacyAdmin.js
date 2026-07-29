const LEGACY_ADMIN_EMAIL = 'admin@synergy.com';
const LEGACY_ADMIN_PASSWORD = 'Admin@123456';

function isLegacyAdminEmail(email) {
  return String(email || '').toLowerCase().trim() === LEGACY_ADMIN_EMAIL;
}

module.exports = {
  LEGACY_ADMIN_EMAIL,
  LEGACY_ADMIN_PASSWORD,
  isLegacyAdminEmail,
};
