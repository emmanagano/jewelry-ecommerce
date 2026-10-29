# Deploying

## 1. Vercel

1. Push the repo to GitHub, then in Vercel: **Add New → Project → Import** the repo. The framework preset (Next.js) and build command (`npm run build`) are detected automatically.
2. **Settings → Environment Variables** (Production, and Preview if you use it). See `.env.example`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL`: your real domain, e.g. `https://example.com`. Optional on Vercel (it falls back to the production domain), but set it once you have a custom domain.
   - `REVALIDATE_SECRET`: a fresh value from `openssl rand -hex 32`. Use a different one from your local `.env.local`.
3. Deploy. After adding a custom domain (**Settings → Domains**), update `NEXT_PUBLIC_SITE_URL` and redeploy.

## 2. Supabase Auth (point it at the real domain)

**Authentication → URL Configuration**
- **Site URL:** `https://your-domain`
- **Redirect URLs:** keep `http://localhost:3000/**` for local work and add `https://your-domain/**`. For Vercel preview deployments, also add `https://*-<your-vercel-team>.vercel.app/**`.

**Authentication → Emails**
- **SMTP Settings:** connect your provider (Resend, Postmark, SendGrid) with a verified sending domain. Without it, emails only reach your Supabase team members.
- **Templates** (so links work on any device), change the link in:
  - Confirm signup: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/account`
  - Reset password: `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/reset-password`

**Authentication → Sign In / Providers → Email:** Confirm email on; minimum password length 8.

## 3. Catalog cache webhooks

Catalog pages are cached for an hour. These webhooks clear the cache as soon as a product, variant, category or collection changes in Supabase.

1. **Database → Webhooks → Enable webhooks** (once).
2. Open `supabase/templates/revalidate_webhooks.sql`, replace `<SITE_URL>` and `<REVALIDATE_SECRET>` (the **production** values), and run it in the SQL Editor. Don't commit the filled-in copy.
3. Test: change a product's price in the Table Editor, then reload its page. The new price should show immediately.

Supabase can't reach `localhost`, so webhooks only work against a deployed site. To clear the cache locally after editing data, run:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: $(grep ^REVALIDATE_SECRET= .env.local | cut -d= -f2)" \
  -d '{"table":"products"}'
```

(`table` can be `products`, `product_variants`, `categories`, `collections` or `product_collections`.)

## 4. After the first deploy

- Visit `/robots.txt` and `/sitemap.xml` and confirm they list your real domain.
- Submit `https://your-domain/sitemap.xml` in Google Search Console.
- Share a product link in a messaging app to check the preview image.
- Run the auth checklist: sign up with a real email, confirm, merge a guest bag, reset the password.
