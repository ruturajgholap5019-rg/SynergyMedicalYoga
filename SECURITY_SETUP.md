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

## Media

Local uploads are acceptable only for development. For staging/production, configure Cloudinary or another persistent object store. SVG uploads are blocked.

## Email

SMTP is disabled unless all SMTP variables are configured. Never commit SMTP passwords or app passwords.
