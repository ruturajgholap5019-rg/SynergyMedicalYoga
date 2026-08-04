# Security Setup

## Required Production Secrets

Set these outside Git in your hosting provider:

- `MONGO_URI`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ALLOWED_ORIGINS`

Generate JWT secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` must be different.

## Admin Creation

There is no default admin account. Create the first admin with:

```bash
npm --prefix backend run seed:admin
```

Required environment variables:

- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`

The password must be at least 12 characters and include uppercase, lowercase, number, and symbol.

## Legacy Admin Rotation

If the old seeded `admin@synergy.com` account exists in MongoDB, it can be used temporarily for staging, but rotate it before production launch:

```bash
npm --prefix backend run rotate:legacy-admin
```

Required environment variables:

- `LEGACY_ADMIN_NEW_EMAIL`
- `LEGACY_ADMIN_NEW_PASSWORD`
- `LEGACY_ADMIN_NEW_NAME`

The rotation script changes the legacy admin email/password and revokes its refresh sessions.

## Media

Local uploads are acceptable only for development. For staging/production, configure Cloudinary or another persistent object store. SVG uploads are blocked.

## Email

SMTP is disabled unless all SMTP variables are configured. Never commit SMTP passwords or app passwords. For Gmail, enable 2-Step Verification, create an App Password, and set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, and `CONTACT_RECEIVER_EMAIL` in the host environment.
