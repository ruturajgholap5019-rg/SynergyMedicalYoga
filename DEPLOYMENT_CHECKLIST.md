# Deployment Checklist

## Before Staging

- Confirm `backend/.env`, `frontend/.env`, and `admin/.env` exist locally or in the host.
- Use strong JWT secrets and strict `ALLOWED_ORIGINS`.
- Create admin using `npm --prefix backend run seed:admin`.
- Configure persistent media storage before relying on uploads.
- Set `VITE_STAGING_NOINDEX=true` for staging.
- Run `npm run build`.
- Run backend startup check with production-like env.

## Before Production

- Rotate any credentials that were ever committed or shared.
- Replace placeholder policies with approved legal copy.
- Migrate WordPress products, blogs, policies, testimonials, team, gallery, and course content.
- Implement permanent redirect rules for old WordPress URLs.
- Regenerate sitemap with real product/blog URLs.
- Verify contact emails and admin enquiry workflow.
- Keep payment disabled until Cashfree/Stripe verification is completed in a dedicated payment phase.
