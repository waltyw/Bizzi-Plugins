# Bizzi Reviews — sales & licence website

Sells Bizzi Reviews Pro (Stripe subscriptions with country-specific prices), issues licence keys, answers the Pro plugin's licence/update checks and serves the free plugin download.

## Deploy on Vercel + Supabase

1. **Supabase** – create a project. In *Project Settings → Database → Connection string* copy the **Transaction pooler** string (port 6543) and the **Session/direct** string (port 5432).
2. **Create the tables** (once, from your computer):
   ```bash
   cp .env.example .env      # fill in DATABASE_URL and DIRECT_URL
   npm install
   npx prisma db push
   ```
3. **GitHub** – push this folder to a new repository (`.env` is git-ignored).
4. **Vercel** – *Add New → Project*, import the repo (framework preset is detected automatically) and add these Environment Variables:
   | Name | Value |
   |---|---|
   | `DATABASE_URL` | Supabase pooled string + `?pgbouncer=true&connection_limit=1` |
   | `DIRECT_URL` | Supabase direct string |
   | `STRIPE_SECRET_KEY` | `sk_live_...` (or `sk_test_...`) |
   | `STRIPE_WEBHOOK_SECRET` | `whsec_...` from step 5 |
   | `NEXTAUTH_URL` | `https://bizziplugins.co.uk` |
   | `ADMIN_PASSWORD` | a long password for `/admin` |
5. **Stripe webhook** – Developers → Webhooks → Add endpoint `https://bizziplugins.co.uk/api/webhooks/stripe` with events `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`. Copy the signing secret into `STRIPE_WEBHOOK_SECRET` and redeploy.
6. **Domain** – add your domain in Vercel → Settings → Domains.

Every push to the main branch redeploys automatically.

## Plugin URLs

The WordPress plugins are set to `https://bizziplugins.co.uk`. If you ever change domain, update:
- free plugin `bizzi-reviews.php` → `BIZZI_REVIEWS_SITE_URL`
- Pro plugin `bizzi-reviews-pro.php` → `Update URI` header and `BIZZI_REVIEWS_API_URL`

## Updating the Pro package

`lib/pro-package.ts` contains the Pro plugin zip (base64) served to licensed sites via `/api/plugin/download`. Regenerate it and bump `data/plugin-release.json` whenever you release a new Pro version.

## Free licences

Go to `https://bizziplugins.co.uk/admin`, sign in with `ADMIN_PASSWORD`, and use **Issue a free licence** (Pro or Agency, 1 month to lifetime). Free keys work exactly like paid ones and can be revoked or reactivated from the same page.

If you already ran `prisma db push`, run it again once to add the new `note` column.
