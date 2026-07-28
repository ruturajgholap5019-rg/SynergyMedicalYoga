# Deployment Checklist

## Before Staging

- Confirm `backend/.env`, `frontend/.env`, and `admin/.env` exist locally or in the host.
- Use strong JWT secrets and strict `ALLOWED_ORIGINS`.
- Create admin using `npm --prefix backend run seed:admin`.
- Configure persistent media storage before relying on uploads.
- Set `VITE_STAGING_NOINDEX=true` for staging.
- Run `npm run build`.
- Run backend startup check with production-like env.

## Vercel Environment Variables

- Frontend project: set `VITE_API_URL` to the deployed backend `/api` URL, set `VITE_ADMIN_URL` to the deployed admin portal URL, and set `VITE_SITE_URL` to the frontend URL.
- Admin project: set `VITE_API_URL` to the same deployed backend `/api` URL and set `VITE_SITE_URL` to the frontend URL.
- Backend host: set `CLIENT_URL`, `ADMIN_URL`, `BACKEND_URL`, and `ALLOWED_ORIGINS` with the exact frontend/admin/backend deployed URLs.
- Redeploy both Vercel projects after changing env vars; Vite embeds `VITE_*` values at build time.

## Before Production

- Rotate any credentials that were ever committed or shared.
- Replace placeholder policies with approved legal copy.
- Migrate WordPress products, blogs, policies, testimonials, team, gallery, and course content.
- Implement permanent redirect rules for old WordPress URLs.
- Regenerate sitemap with real product/blog URLs.
- Verify contact emails and admin enquiry workflow.
- Keep payment disabled until Cashfree/Stripe verification is completed in a dedicated payment phase.
